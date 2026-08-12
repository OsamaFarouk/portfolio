# Projects and Labs

## 1. Project-system contract

Projects are content records with stable slugs and optional architecture definitions. Published cards are derived from non-draft records. Professional work can be marked sanitized/confidential to avoid exposing client-sensitive implementation details.

At documentation revision 1.0.0, six projects are published.

## 2. Inventory

| Project | Type | Period | Role |
|---|---|---:|---|
| AWS ECS Fargate Container Deployment | Personal Lab | 2026 | Cloud / DevOps Engineer |
| PayHub CI/CD & Kubernetes Release Operations | Professional · Sanitized | 2025 | DevOps Engineer |
| Kubernetes Observability Platform | Personal Lab | 2026 | DevOps / SRE Engineer |
| End-to-End GitLab CI/CD with Kubernetes and Helm | Personal Lab | 2025 | DevOps Engineer |
| STC Enterprise Application Deployment & Observability | Professional · Sanitized | 2024 | DevOps Engineer / Acting Team Lead |
| Highly Available AWS Web Architecture | Training Project · ALX | 2023 | Cloud Computing Trainee |

---

## 3. AWS ECS Fargate Container Deployment

**Route:** `/projects/aws-ecs-fargate-container-deployment`

### Context
Personal AWS lab demonstrating deployment of a containerized web application with managed ECS compute rather than self-managed EC2 container hosts.

### Architecture

```text
Developer
  ↓ build/tag
Docker Image
  ↓ push
Amazon ECR
  ↓ image reference
ECS Task Definition
  ↓ used by
ECS Service
  ↓ launches/maintains
Fargate Tasks

User Traffic → Application Load Balancer → Target Group → Fargate Tasks
VPC/Subnets/Security Groups bound the ALB/task network path
IAM Task Execution Role authorizes ECR image pull/runtime operations
```

### Delivery
Docker image built/tagged and pushed to private ECR; ECS cluster/task definition/service created for Fargate; ALB, listener/target group and health-based registration configured; VPC/subnet/security-group connectivity validated.

### Engineering challenge
Initial ECS service creation failed because the required ECS service-linked role was unavailable. The IAM dependency was resolved, service creation completed and target registration validated.

### Operational outcome
The application was exposed through an ALB without managing EC2 instances. Lab resources were removed after validation to avoid unnecessary AWS charges.

### Stack
AWS, ECS, Fargate, ECR, Docker, ALB, VPC, IAM.

---

## 4. PayHub CI/CD & Kubernetes Release Operations

**Route:** `/projects/payhub-release-operations`

### Context
Sanitized professional release operations for ProgressSoft / Boubyan Bank PayHub ACH and DMS services across local and bank UAT environments.

### Delivery model
GitLab CI/CD and Helm-based Kubernetes deployments; versioned container images in a private registry; deployment validation and workload recovery.

### Engineering issues represented

- unavailable/mismatched image tags;
- Helm values/type problems;
- Kubernetes security-policy constraints;
- job configuration/label issues;
- probes and workload restart behavior;
- deployment blockers affecting environment readiness.

### Outcomes
Supported ACH/DMS releases, improved release traceability through aligned image versions and restored affected Kubernetes workloads to healthy state when blockers occurred.

### Stack
CI/CD, Kubernetes, GitLab CI/CD, Helm, Docker, private container registry, Linux, PayHub, ACH/DMS.

### Confidentiality rule
Keep implementation sanitized. Never add bank secrets, internal addresses, credentials, production data, proprietary configuration or unapproved client details.

---

## 5. Kubernetes Observability Platform

**Route:** `/projects/kubernetes-observability-platform`

### Context
Personal lab for centralized Kubernetes metrics, container logs, Grafana dashboards and alerting.

### Architecture
The monitoring stack uses Prometheus/Grafana/Alertmanager plus kube-state-metrics and node-exporter, with Loki/Promtail for logs. Helm is used to make installation/configuration repeatable.

### Operational areas

- cluster/node/workload metrics;
- container log aggregation;
- Grafana operational investigation;
- alert routing;
- scrape-target and interval tuning;
- high-cardinality considerations;
- monitoring-stack resource limits.

### Stack
Kubernetes, Prometheus, Grafana, Loki, node-exporter, Promtail, Helm, kube-state-metrics, Alertmanager.

### Current content debt
The live detail page contains conditional language such as “if tested” / “if actually implemented” in some alert-related wording. This reads like an authoring note and should be replaced with a factual final statement based on what was actually validated.

---

## 6. End-to-End GitLab CI/CD with Kubernetes and Helm

**Route:** `/projects/gitlab-cicd-kubernetes-helm-lab`

### Context
Personal lab implementing an end-to-end CI/CD flow for a Java application into local Kubernetes.

### Delivery flow

```text
Commit
→ GitLab CI/CD
→ Shell Runner
→ Maven build/test
→ Docker build
→ date + short-SHA image tag
→ Docker Hub
→ Helm deployment
→ Minikube Kubernetes
→ NGINX Ingress
→ application + MySQL dependency
```

### Engineering implementation

- local GitLab Shell Runner;
- versioned Docker images;
- reusable Helm chart;
- dedicated kubeconfig for runner access;
- Minikube target environment;
- ingress-based app routing;
- MySQL startup dependency guarded by init behavior/health checks.

### Troubleshooting represented
Duplicate Ingress configuration and local routing/dependency issues were handled during the delivery workflow.

### Stack
CI/CD, GitLab CI/CD, GitLab Runner, Maven, Kubernetes, Minikube, Helm, Docker, Docker Hub, MySQL, NGINX Ingress, Linux.

---

## 7. STC Enterprise Application Deployment & Observability

**Route:** `/projects/stc-enterprise-cluster`

### Context
Sanitized professional project for internal STC applications in a local Kubernetes environment.

### Delivery
Jenkins-based deployment automation to Kubernetes plus Prometheus/Grafana infrastructure and API monitoring with Slack alerting.

### Operational contribution
The project combines deployment repeatability, observability and team-operating practices. The production card identifies an Acting Team Lead dimension, aligned with standardized reporting and technical documentation work.

### Stack
Kubernetes, Jenkins, Docker, Prometheus, Grafana, Linux.

---

## 8. Highly Available AWS Web Architecture

**Route:** `/projects/highly-available-aws-architecture`

### Context
ALX training project for a highly available AWS web architecture.

### Architecture

```text
Internet
  ↓
Application Load Balancer (public subnets, multi-AZ)
  ↓
EC2 Auto Scaling instances (private subnets, multi-AZ)
  ├── private Gateway VPC Endpoint → Amazon S3
  └── private Gateway VPC Endpoint → DynamoDB
```

Supporting controls include VPC segmentation, route tables, security groups, ALB health checks and Auto Scaling replacement behavior.

### Outcomes
Reduced single-AZ dependency, automated unhealthy-instance replacement, used private service connectivity for S3/DynamoDB access, and reinforced AWS availability/networking/security principles.

### Stack
AWS, EC2, Application Load Balancer, VPC, VPC Endpoints, Auto Scaling, DynamoDB, S3, IAM, Security Groups.

## 9. Adding a project safely

Use the repository content tool (`npm run add:project`) where practical or edit `content/projects.json` carefully.

Minimum maintenance sequence:

1. Create a unique stable slug.
2. Set accurate type/status/date/role and `draft` state.
3. Write a concise card-level tagline.
4. Add factual background, solution, responsibilities, challenges and results.
5. Add only technologies actually used.
6. Add Mermaid architecture only when it increases technical clarity.
7. Mark professional/client work sanitized/confidential as appropriate.
8. Run `npm run validate:content` then the full check/release workflow.
9. Inspect search/filter behavior and detail route.
10. Update this file, the feature inventory if category behavior changes, and `CHANGELOG.md`.
