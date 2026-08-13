CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    workspace_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_projects_workspace
        FOREIGN KEY (workspace_id) REFERENCES workspaces (id)
);
