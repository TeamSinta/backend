import os

import workos
from django.core.management.base import BaseCommand
from workos import client

from company.models import Company
from interview.models import Candidate, InterviewRound, InterviewRoundQuestion
from interview_templates.models import Template, TemplateQuestion, TemplateTopic
from question.models import Comment, Question, QuestionBank
from question_response.models import Answer, InterviewerFeedback
from summary.models import Summary
from transcription.models import TranscriptChunk
from user.models import CustomUser, UserCompanies

workos.api_key = os.environ.get("WORKOS_APIKEY")
workos.client_id = os.environ.get("WORKOS_CLIENT")
USER_PATH = "user_management/users"


class Command(BaseCommand):
    help = "Seeds 10 users to the database."

    def handle(self, *args, **kwargs):
        self.stdout.write("... Migrating Old DB to New ...")

        try:
            all_users = CustomUser.objects.all()
            for user in all_users:
                print("Starting migration for all users: ", user)

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
                new_user, _ = CustomUser.objects.get_or_create(
                    id=workos_user_id,
                    defaults={
                        "email": user.email,
                        "is_active": True,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "id": workos_user_id,
                        "username": user.username + "_1",
                        "profile_picture": getattr(user, "profile_picture", ""),
                    },
                )
                # updating interview templates user id to new work os id
                print("Created new user: ", new_user, _)

                Template.objects.filter(user=user.id).update(user=new_user)
                Template.objects.filter(deleted_by=user.id).update(deleted_by=new_user)

                TemplateTopic.objects.filter(user=user.id).update(user=new_user)
                TemplateTopic.objects.filter(deleted_by=user.id).update(deleted_by=new_user)

                TemplateQuestion.objects.filter(deleted_by=user.id).update(deleted_by=new_user)

                Candidate.objects.filter(user=user.id).update(user=new_user)
                Candidate.objects.filter(deleted_by=user.id).update(deleted_by=new_user)

                InterviewRound.objects.filter(user=user.id).update(user=new_user)
                InterviewRound.objects.filter(deleted_by=user.id).update(deleted_by=new_user)

                InterviewRoundQuestion.objects.filter(user=user.id).update(user=new_user)
                InterviewRoundQuestion.objects.filter(deleted_by=user.id).update(deleted_by=new_user)

                Question.objects.filter(user=user.id).update(user=new_user)
                Question.objects.filter(deleted_by=user.id).update(deleted_by=new_user)

                QuestionBank.objects.filter(user=user.id).update(user=new_user)
                QuestionBank.objects.filter(deleted_by=user.id).update(deleted_by=new_user)

                Comment.objects.filter(user=user.id).update(user=new_user)
                Comment.objects.filter(deleted_by=user.id).update(deleted_by=new_user)

                InterviewerFeedback.objects.filter(user=user.id).update(user=new_user)
                InterviewerFeedback.objects.filter(deleted_by=user.id).update(deleted_by=new_user)

                TranscriptChunk.objects.filter(user=user.id).update(user=new_user)
                TranscriptChunk.objects.filter(deleted_by=user.id).update(deleted_by=new_user)

                Summary.objects.filter(user=user.id).update(user=new_user)
                Summary.objects.filter(deleted_by=user.id).update(deleted_by=new_user)

                Answer.objects.filter(user=user.id).update(user=new_user)
                Answer.objects.filter(deleted_by=user.id).update(deleted_by=new_user)

                user_companies = UserCompanies.objects.filter(user=user.id)

                for company in user_companies:
                    print("Migrating user company: ", company.id)
                    company_name = company.company.name
                    print("Company name: ", company_name)
                    old_company_id = company.company.id
                    print("old_company_id: ", old_company_id)

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
                    print("organization_membership.get(id): ", organization_membership.get("id"))

                    new_company, _ = Company.objects.get_or_create(
                        id=org_id, defaults={"id": org_id, "name": org_name}
                    )
                    print("Created new Company: ", new_company)

                    user_company = UserCompanies.objects.get(user=user.id, company=old_company_id)
                    print("user comp", user_company.role)
                    UserCompanies.objects.get_or_create(
                        user=new_user,
                        company=new_company,
                        defaults={"role": user_company.role, "id": organization_membership.get("id")},
                    )
                    print("New UserCompanies record created successfully.")
                    print("Created new user and associated with company.")

                    Template.objects.filter(company=old_company_id).update(company=new_company)
                    TemplateTopic.objects.filter(company=old_company_id).update(company=new_company)
                    Candidate.objects.filter(company=old_company_id).update(company=new_company)
                    InterviewRound.objects.filter(company=old_company_id).update(company=new_company)
                    InterviewRoundQuestion.objects.filter(company=old_company_id).update(company=new_company)
                    Question.objects.filter(company=old_company_id).update(company=new_company)
                    QuestionBank.objects.filter(company=old_company_id).update(company=new_company)
                    Comment.objects.filter(company=old_company_id).update(company=new_company)
                    InterviewerFeedback.objects.filter(company=old_company_id).update(company=new_company)
                    Summary.objects.filter(company=old_company_id).update(company=new_company)

                    company_to_delete = Company.objects.get(id=old_company_id)

                    user_company.delete()
                    print("Deleted old user company.")
                    company_to_delete.delete()
                    print("Deleted old company.")

                print("Now Deleting old User.")
                user.delete()
                print("Deleted old User.")
            self.stdout.write("Migration completed.")
        except Exception as e:
            print("Error during migration: ", e)
            if "errors" in str(e) and "email_not_available" in str(e.errors):
                print("Skipping user creation. Error: ")
