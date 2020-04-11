/// <reference path='../node_modules/mocha-typescript/globals.d.ts' />
import * as firebase from "@firebase/testing";
import * as fs from "fs";

/**
 * Firestore rules testing.
 * adapted from https://github.com/firebase/quickstart-nodejs/tree/master/firestore-emulator/typescript-quickstart
 */

/*
 * ============
 *    Setup
 * ============
 */
const projectId = "facegen";
const coverageUrl = `http://localhost:8080/emulator/v1/projects/${projectId}:ruleCoverage.html`;

const rules = fs.readFileSync("firestore.rules", "utf8");

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth) {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
}

/*
 * ============
 *  Test Cases
 * ============
 */
before(async () => {
  await firebase.loadFirestoreRules({ projectId, rules });
});

beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId });
});

after(async () => {
  await Promise.all(firebase.apps().map((app) => app.delete()));
  console.log(`View rule coverage information at ${coverageUrl}\n`);
});

@suite
class MyApp {
  @test
  async "require users to log in before creating a profile"() {
    const db = authedApp(null);
    const profile = db.collection("users").doc("alice");
    await firebase.assertFails(profile.set({ birthday: "January 1" }));
  }

  @test
  async "should enforce the createdAt date in user profiles"() {
    const db = authedApp({ uid: "alice" });
    const profile = db.collection("users").doc("alice");
    await firebase.assertFails(profile.set({ birthday: "January 1" }));
    await firebase.assertSucceeds(
      profile.set({
        birthday: "January 1",
        signupDate: firebase.firestore.FieldValue.serverTimestamp(),
      })
    );
  }

  @test
  async "should only let users create their own profile"() {
    const db = authedApp({ uid: "alice" });
    await firebase.assertSucceeds(
      db
        .collection("users")
        .doc("alice")
        .set({
          birthday: "January 1",
          signupDate: firebase.firestore.FieldValue.serverTimestamp(),
        })
    );
    await firebase.assertFails(
      db
        .collection("users")
        .doc("bob")
        .set({
          birthday: "January 1",
          signupDate: firebase.firestore.FieldValue.serverTimestamp(),
        })
    );
  }

  @test
  async "should let user edit their profile"() {
    const db = authedApp({ uid: "alice" });
    const profile = db.collection("users").doc("alice");

    await firebase.assertSucceeds(
      profile.set({
        birthday: "January 1",
        signupDate: firebase.firestore.FieldValue.serverTimestamp(),
      })
    );

    await firebase.assertSucceeds(
      profile.set({ logged: true }, { merge: true })
    );

    await firebase.assertSucceeds(profile.get());
  }

  @test
  async "shouldn't let anyone read any profile"() {
    const db = authedApp(null);
    const profile = db.collection("users").doc("alice");
    await firebase.assertFails(profile.get());
  }

  @test
  async "should let user create a face"() {
    const db = authedApp({ uid: "alice" });
    const room = db
      .collection("users")
      .doc("alice")
      .collection("faces")
      .doc("newFace");
    await firebase.assertSucceeds(
      room.set({
        timeCreated: firebase.firestore.FieldValue.serverTimestamp(),
      })
    );
  }

  @test
  async "should enforce timeCreated field in face"() {
    const db = authedApp({ uid: "alice" });
    const room = db
      .collection("users")
      .doc("alice")
      .collection("faces")
      .doc("newFace");
    await firebase.assertSucceeds(
      room.set({
        timeCreated: firebase.firestore.FieldValue.serverTimestamp(),
      })
    );

    const room2 = db
      .collection("users")
      .doc("alice")
      .collection("faces")
      .doc("newFace2");

    await firebase.assertFails(
      room2.set({
        test: "hello",
      })
    );
  }

  @test
  async "should not let one user edit another users face doc"() {
    const alice = authedApp({ uid: "alice" });
    const bob = authedApp({ uid: "bob" });

    await firebase.assertSucceeds(
      bob
        .collection("users")
        .doc("bob")
        .collection("faces")
        .doc("bobsFace")
        .set({
          timeCreated: firebase.firestore.FieldValue.serverTimestamp(),
        })
    );

    await firebase.assertFails(
      alice
        .collection("users")
        .doc("bob")
        .collection("faces")
        .doc("bobsFace")
        .set({
          test: "new",
        })
    );
  }

  @test
  async "should let user delete face doc"() {
    const alice = authedApp({ uid: "alice" });
    const faceRef = alice
      .collection("users")
      .doc("alice")
      .collection("faces")
      .doc("aliceFace");

    await firebase.assertSucceeds(
      faceRef.set({
        timeCreated: firebase.firestore.FieldValue.serverTimestamp(),
      })
    );

    await firebase.assertSucceeds(faceRef.delete());
  }
}
