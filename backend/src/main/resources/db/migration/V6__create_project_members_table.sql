CREATE TABLE project_members (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_members_project
        FOREIGN KEY (project_id) REFERENCES projects (id),
    CONSTRAINT fk_project_members_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT uk_project_members_project_user
        UNIQUE (project_id, user_id)
);
