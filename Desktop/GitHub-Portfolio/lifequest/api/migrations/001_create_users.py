steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE users (
            id SERIAL PRIMARY KEY NOT NULL,
            username VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(256) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            CONSTRAINT check_username_length CHECK (LENGTH(username) >= 1),
            CONSTRAINT check_password_length CHECK (LENGTH(password) >= 1),
            CONSTRAINT check_first_name_length CHECK (LENGTH(first_name) >= 1),
            CONSTRAINT check_email_length CHECK (LENGTH(email) >= 1)
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE users;
        """,
    ],
]
