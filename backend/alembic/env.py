from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config.settings import settings
from models import database_models
from models.auth import User, Waitlist
from models.profile import UserProfile
from models.skills import Skill, UserSkill
from models.experience import Experience, ExperienceSkill
from models.application import JobApplication, JobApplicationExperience, JobApplicationSkill
from models.cover_letter import CoverLetter, CoverLetterExperience
from models.subscription import SubscriptionTier, UserSubscription, UserUsage

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Include all model metadata
target_metadata = [
    database_models.Base.metadata,
    User.metadata,
    Experience.metadata,
    JobApplication.metadata,
    Waitlist.metadata,
    UserProfile.metadata,
    Skill.metadata,
    UserSkill.metadata,
    ExperienceSkill.metadata,
    JobApplicationExperience.metadata,
    JobApplicationSkill.metadata,
    CoverLetter.metadata,
    CoverLetterExperience.metadata,
    SubscriptionTier.metadata,
    UserSubscription.metadata,
    UserUsage.metadata
]

def run_migrations_offline() -> None:
    url = settings.DATABASE_URL
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = settings.DATABASE_URL
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()