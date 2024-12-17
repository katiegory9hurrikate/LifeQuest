steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE quests (
            id SERIAL PRIMARY KEY NOT NULL,
            title VARCHAR(100) NOT NULL,
            completed BOOL NOT NULL,
            description VARCHAR(250) NULL,
            user_id INTEGER REFERENCES users(id),
            CONSTRAINT check_title_length CHECK (LENGTH(title) >= 1)
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE quests;
        """,
    ],
]
