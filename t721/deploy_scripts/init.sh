#! /bin/bash
# Create Service Account
kubectl create -f ./deploy_scripts/rbac/rbac.yaml

kubectl create clusterrolebinding cluster-admin-binding \
  --clusterrole cluster-admin \
  --user $(gcloud config get-value account)

# Initialize helm
helm init --service-account tiller --history-max 200 --wait
