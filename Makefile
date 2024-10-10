BUILDER_IMAGE_NODE=node:20.18.0-bullseye

define docker-inside-node
	docker run \
		--rm -t \
		-u node \
		-v $(CURDIR):/app \
		-w /app \
		$(BUILDER_IMAGE_NODE) \
		sh -x -c "$(strip $(1))"
endef


################################################################################
.PHONY: build-app
build-app:
	$(call docker-inside-node, npm ci)
	$(call docker-inside-node, npm run build-storybook)
################################################################################
.PHONY: build-image
build-image:
	@docker build -t ${app_image} \
		--build-arg BUILDER_IMAGE_NODE=$(BUILDER_IMAGE_NODE) \
		-f ${docker_file} .
################################################################################
.PHONY: test
test:
	$(call docker-inside-node, npm run test)
################################################################################
.PHONY: lint
lint:
	$(call docker-inside-node, npm run lint)