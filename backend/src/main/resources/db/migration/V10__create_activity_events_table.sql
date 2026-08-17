CREATE TABLE activity_events (
    id BIGSERIAL PRIMARY KEY,
    task_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_activity_events_task
        FOREIGN KEY (task_id) REFERENCES tasks (id),
    CONSTRAINT fk_activity_events_user
        FOREIGN KEY (user_id) REFERENCES users (id)
);
