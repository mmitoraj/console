IMG_NAME = ui-tests
IMG = $(DOCKER_PUSH_REPOSITORY)$(DOCKER_PUSH_DIRECTORY)/$(IMG_NAME)
TAG = $(DOCKER_TAG)

ci-pr: install-dependencies validate build-image push-image
ci-master: install-dependencies validate build-image push-image
ci-release: install-dependencies validate build-image push-image

install-dependencies:
	npm ci

validate:
	npm run lint-check
	eslint -c .eslinterrc ./ui-tests

build-image:
	docker build -t $(IMG_NAME) .

push-image:
	docker tag $(IMG_NAME) $(IMG):$(TAG)
	docker push $(IMG):$(TAG)
