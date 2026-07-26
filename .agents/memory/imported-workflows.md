---
name: Imported workflow verification
description: Environment-specific behavior when validating imported artifact projects.
---

Imported projects can contain `.replit-artifact/artifact.toml` service definitions without those services being registered as managed workflows in the current workspace.

**Why:** A restart by artifact workflow name cannot verify the app until the workspace registers the workflow; code builds and typechecks can still be run independently.

**How to apply:** Check `listWorkflows()` before attempting `WorkflowsRestart`. If it returns no workflows, report that runtime preview verification is unavailable rather than changing the imported service structure solely to create a workflow.