CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    task_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_comments_task
        FOREIGN KEY (task_id) REFERENCES tasks (id),
    CONSTRAINT fk_comments_user
        FOREIGN KEY (user_id) REFERENCES users (id)
);
