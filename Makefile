# Docker image name and tag
IMAGE_NAME ?= runhaofu/project_vue
REGISTRY ?= registry.cn-chengdu.aliyuncs.com
# Define the full image name
FULL_IMAGE_NAME := $(REGISTRY)/$(IMAGE_NAME)
# Define the buildx image name
BUILDX_IMAGE_NAME ?= project

# Login to Docker registry
.PHONY: login
login:
	@echo "Logging into Docker registry..."
	@echo "Username: $(DOCKER_USERNAME)"
	@docker login -u $(DOCKER_USERNAME) -p $(DOCKER_PASSWORD) $(REGISTRY) || { echo "Login failed"; exit 1; }

# Build the Docker image
.PHONY: build
build:
	docker buildx create --name $(BUILDX_IMAGE_NAME) --use
	docker buildx inspect --bootstrap
	docker buildx build --platform linux/arm64 -t $(FULL_IMAGE_NAME) . --push || { echo "Build failed"; exit 1; }

# Clean up the local Docker images
.PHONY: clean
clean:
	docker buildx rm || { echo "Cleanup failed"; exit 1; }

# Run all tasks: login, build, push and clean
.PHONY: all
all: login build push clean