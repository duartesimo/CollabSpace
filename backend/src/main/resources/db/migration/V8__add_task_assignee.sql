ALTER TABLE tasks
    ADD COLUMN assignee_id BIGINT,
    ADD CONSTRAINT fk_tasks_assignee
        FOREIGN KEY (assignee_id) REFERENCES users (id);
