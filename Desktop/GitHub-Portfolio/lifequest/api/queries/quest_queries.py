import os
import psycopg
from psycopg_pool import ConnectionPool
from psycopg.rows import class_row
from typing import Optional
from models.quests import QuestResponse
from utils.exceptions import UserDatabaseException

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

pool = ConnectionPool(DATABASE_URL)


class QuestQueries:
    def get_quest_by_id(self, id: int) -> Optional[QuestResponse]:
        """
        Gets a quest from the database by quest id

        Returns None if the quest isn't found
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(QuestResponse)) as cur:
                    cur.execute(
                        """
                            SELECT
                                *
                            FROM quests
                            WHERE id = %s
                            """,
                        [id],
                    )
                    quest = cur.fetchone()
                    if not quest:
                        return None
        except psycopg.Error as e:
            print(e)
            raise UserDatabaseException(f"Error getting quest with id {id}")

        return quest

    def create_quest(
        self,
        user_id: int,
        title: str,
        description: str,
        completed: bool = False,
    ) -> QuestResponse:
        """
        Creates a new quest in the database

        Raises a UserInsertionException if creating the user fails
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(QuestResponse)) as cur:
                    cur.execute(
                        """
                        INSERT INTO quests (
                            title,
                            description,
                            completed,
                            user_id
                        ) VALUES (
                            %s, %s, %s, %s
                        )
                        RETURNING *;
                        """,
                        [title, description, completed, user_id],
                    )
                    quest = cur.fetchone()
                    if not quest:
                        raise UserDatabaseException(
                            f"Could not create user quest"
                        )
        except psycopg.Error:
            raise UserDatabaseException(f"Could not create user quest")
        return quest

    def get_all_user_quests(self, user_id: int) -> list[QuestResponse]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(QuestResponse)) as cur:
                    cur.execute(
                        """
                        SELECT *
                        FROM quests
                        WHERE user_id = %s
                        """,
                        [user_id],
                    )
                    all_quests = cur.fetchall()
        except psycopg.Error:
            raise UserDatabaseException(f"Could not locate user quests")
        return all_quests

    def update_user_quest_details(
        self,
        user_id: int,
        quest_id: int,
        title: str,
        description: str,
        completed: bool,
    ) -> QuestResponse:
        """
        updates a quest in the database

        Raises a UserDatabaseException if updating the user quest fails
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(QuestResponse)) as cur:
                    cur.execute(
                        """
                        UPDATE quests
                        SET title = COALESCE(%s, title),
                            description = COALESCE(%s, description),
                            completed= %s
                        WHERE id = %s AND user_id = %s
                        RETURNING id, user_id, title, description, completed
                        """,
                        [title, description, completed, quest_id, user_id],
                    )
                    updated_quest_details = cur.fetchone()
                    if not updated_quest_details:
                        raise UserDatabaseException(
                            f"Could not create user quest"
                        )
        except psycopg.Error:
            raise UserDatabaseException(f"Could not update user quest")
        return updated_quest_details

    def delete_user_quest_by_id(self, id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(QuestResponse)) as cur:
                    cur.execute(
                        """
                            DELETE FROM quests
                            WHERE id = %s
                            """,
                        [id],
                    )
                    if cur.rowcount == 0:
                        return f"No quest to delete"
        except psycopg.Error as e:
            print(e)
            raise UserDatabaseException(
                f"Error deleting quest with id of {id}"
            )

        return True
