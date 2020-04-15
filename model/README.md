Uses https://github.com/pfnet-research/chainer-stylegan

Triggered by Google Pub/Sub generate-face topic.

Deploy:

```
gcloud beta functions deploy subscribe --runtime python37 --trigger-topic generate-face
```
