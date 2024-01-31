import os

import workos
from django.core.management.base import BaseCommand
from workos import client

from company.models import Company, Department
from interview.models import Candidate, InterviewRound, InterviewRoundQuestion
from interview_templates.models import Template, TemplateTopic
from question.models import Comment, Question, QuestionBank
from question_response.models import Answer, InterviewerFeedback
from summary.models import Summary
from transcription.models import TranscriptChunk
from user.models import CustomUser, Role, UserCompanies, UserDepartments

workos.api_key = os.environ.get("WORKOS_APIKEY")
workos.client_id = os.environ.get("WORKOS_CLIENT")
USER_PATH = "user_management/users"


class Command(BaseCommand):
    help = "Seeds 10 users to the database."

    def handle(self, *args, **kwargs):
        self.stdout.write("... Migrating Old DB to New ...")

        try:
            all_users = CustomUser.objects.all()
            print("Starting migration for all users: ", all_users)
            for user in all_users:
                print("Migrating user: ", user.email)
                new_workos_user = client.user_management.create_user(
                    {
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                    }
                )
                workos_user_id = new_workos_user.get("id", "")
                print("Created WorkOS user with ID: ", workos_user_id)
                user_companies = UserCompanies.objects.filter(user=user.id)

                for company in user_companies:
                    print("Migrating company: ", company.id)
                    company_name = company.company.name
                    print("Company name: ", company_name)
                    new_org = client.organizations.create_organization(
                        {"name": company_name, "domains": [os.environ.get("DEFAULT_DOMAIN")]}
                    )

                    print("Created WorkOS organization: ", new_org)
                    org_id = new_org.get("id", "")
                    org_name = new_org.get("name", "")
                    organization_membership = client.user_management.create_organization_membership(
                        user_id=workos_user_id,
                        organization_id=org_id,
                    )

                    print("Created organization membership: ", organization_membership)
                    new_user, _ = CustomUser.objects.get_or_create(
                        username=user.username,
                        defaults={
                            "email": user.email,
                            "is_active": True,
                            "first_name": user.first_name,
                            "last_name": user.last_name,
                            "id": workos_user_id,
                            "profile_picture": getattr(user, "profile_picture", ""),
                        },
                    )

                    # TODO: if user found with user name then id is not updating
                    print("Created new user: ", new_user, _)

                    new_company, _ = Company.objects.get_or_create(name=org_name, defaults={"id": org_id})
                    print("Created new Company: ", new_company)

                    # TODO: if Company found with user name then id is not updating
                    if new_company.id is None and new_company.id == company.company.id:
                        new_company.id = org_id
                        new_company.save()
                    role, _ = Role.objects.get_or_create(name=company.role)
                    UserCompanies.objects.get_or_create(user=new_user, company=new_company, defaults={"role": role})

                    # Update user and company for records where deleted_by is null

                    print("Created new user and associated with company.")
                    departments = Department.objects.filter(company=company.id)
                    for department in departments:
                        department.company = new_company
                        department.save()
                        print("Updated department: ", department)
                        UserDepartments.objects.filter(user=user.id, department=department.id).update(
                            user=new_user, department=department
                        )

                    Candidate.objects.filter(user=user.id, company=company.id, deleted_by__isnull=True).update(
                        user=new_user, company=new_company
                    )
                    InterviewRound.objects.filter(user=user.id, company=company.id, deleted_by__isnull=True).update(
                        user=new_user, company=new_company
                    )
                    InterviewRoundQuestion.objects.filter(
                        user=user.id, company=company.id, deleted_by__isnull=True
                    ).update(user=new_user, company=new_company)
                    Template.objects.filter(user=user.id, company=company.id, deleted_by__isnull=True).update(
                        user=new_user, company=new_company
                    )
                    TemplateTopic.objects.filter(user=user.id, company=company.id, deleted_by__isnull=True).update(
                        user=new_user, company=new_company
                    )
                    Question.objects.filter(user=user.id, company=company.id, deleted_by__isnull=True).update(
                        user=new_user, company=new_company
                    )
                    QuestionBank.objects.filter(user=user.id, company=company.id, deleted_by__isnull=True).update(
                        user=new_user, company=new_company
                    )
                    Comment.objects.filter(user=user.id, company=company.id, deleted_by__isnull=True).update(
                        user=new_user, company=new_company
                    )

                    InterviewerFeedback.objects.filter(
                        user=user.id, company=company.id, deleted_by__isnull=True
                    ).update(user=new_user, company=new_company)
                    Answer.objects.filter(user=user.id, deleted_by__isnull=True).update(user=new_user)

                    Summary.objects.filter(user=user.id, company=company.id, deleted_by__isnull=True).update(
                        user=new_user, company=new_company
                    )

                    TranscriptChunk.objects.filter(user=user.id, deleted_by__isnull=True).update(user=new_user)

                    # Update user, company and deleted_by for records where deleted_by is not null
                    Candidate.objects.filter(company=company.id, deleted_by=user.id).update(
                        user=new_user, company=new_company, deleted_by=new_user
                    )
                    InterviewRound.objects.filter(company=company.id, deleted_by=user.id).update(
                        user=new_user, company=new_company, deleted_by=new_user
                    )
                    InterviewRoundQuestion.objects.filter(company=company.id, deleted_by=user.id).update(
                        user=new_user, company=new_company, deleted_by=new_user
                    )
                    Template.objects.filter(company=company.id, deleted_by=user.id).update(
                        user=new_user, company=new_company, deleted_by=new_user
                    )
                    TemplateTopic.objects.filter(company=company.id, deleted_by=user.id).update(
                        user=new_user, company=new_company, deleted_by=new_user
                    )
                    Question.objects.filter(company=company.id, deleted_by=user.id).update(
                        user=new_user, company=new_company, deleted_by=new_user
                    )
                    QuestionBank.objects.filter(company=company.id, deleted_by=user.id).update(
                        user=new_user, company=new_company, deleted_by=new_user
                    )
                    Comment.objects.filter(company=company.id, deleted_by=user.id).update(
                        user=new_user, company=new_company, deleted_by=new_user
                    )

                    InterviewerFeedback.objects.filter(company=company.id, deleted_by=user.id).update(
                        user=new_user, company=new_company, deleted_by=new_user
                    )
                    Answer.objects.filter(deleted_by=user.id).update(user=new_user, deleted_by=new_user)

                    Summary.objects.filter(company=company.id, deleted_by=user.id).update(
                        user=new_user, company=new_company, deleted_by=new_user
                    )

                    TranscriptChunk.objects.filter(deleted_by=user.id).update(user=new_user, deleted_by=new_user)

                    # after creating all duplicate records delete user and company
                    print("Updated all records. Now deleting old user and company.")
                    print(user.id)
                    # TODO: Need to verify
                    if user.id is not None and user.id != new_user.id:
                        user.delete()
                        print("Deleted old user.")
                    if company.id is not None and company.id != new_company.id:
                        company.delete()
                        print("Deleted old company.")
            self.stdout.write("Migration completed.")
        except Exception as e:
            print("Error during migration: ", e)
            if "errors" in str(e) and "email_not_available" in str(e.errors):
                print("Skipping user creation. Error: ")
