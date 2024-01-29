import os

import workos
from django.core.management.base import BaseCommand
from workos import client

from company.models import Company
from user.models import CustomUser, Role, UserCompanies

workos.api_key = os.environ.get("WORKOS_APIKEY")
workos.client_id = os.environ.get("WORKOS_CLIENT")


class Command(BaseCommand):
    help = "Seeds 10 users to the database."

    def handle(self, *args, **kwargs):
        self.stdout.write("... Migrating Old DB to New ...")

        try:
            alluser = CustomUser.objects.all()
            print("alluser  > ", alluser)
            for user in alluser:
                print("user > ", user.email)

                workos_user = client.user_management.create_user(
                    {
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                    }
                )
                workos_userID = workos_user.get("id", "")
                print("workos_userID : ", workos_userID)
                user_company = UserCompanies.objects.filter(user=user.id)
                # print("company > ", user_company.id)
                # print("user_company companyid > ", user_company.company)

                for company in user_company:
                    print("company > ", company.id)
                    print("user_companies companyid > ", company.company)
                    print("user_companies roloe > ", company.role)
                    compName = company.company
                    new_org = client.organizations.create_organization({"name": compName, "domains": ["foo-corp.com"]})

                    print("new_orga  > ", new_org)
                    org_Id = new_org.get("id", "")
                    org_name = new_org.get("name", "")
                    organization_membership = client.user_management.create_organization_membership(
                        user_id=workos_userID,
                        organization_id=org_Id,
                    )

                    # print("organization_membership > ", organization_membership)
                    newUser, created = CustomUser.objects.get_or_create(
                        username=user.username,
                        defaults={
                            "email": user.email,
                            "is_active": True,
                            "first_name": user.first_name,
                            "last_name": user.last_name,
                            "id": workos_userID,
                            "profile_picture": user.get("profile_picture", ""),
                        },
                    )

                    companyNew, created = Company.objects.get_or_create(name=org_name, id=org_Id)
                    role, created = Role.objects.get_or_create(name=company.role)
                    UserCompanies.objects.get_or_create(user=newUser, company=companyNew, defaults={"role": role})
                    # create remaing table recordes below

                    # after creating all duplicate records delete user and company
                    user.delete()
                    company.delete()
            self.stdout.write("Done.")
        except Exception as e:
            print("migrate >> ", e)
