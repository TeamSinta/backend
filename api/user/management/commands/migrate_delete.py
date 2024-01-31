import os

import workos
from django.core.management.base import BaseCommand
from workos import client
from workos.utils.request import REQUEST_METHOD_GET, RequestHelper

workos.api_key = os.environ.get("WORKOS_APIKEY")
workos.client_id = os.environ.get("WORKOS_CLIENT")
USER_PATH = "user_management/users"


class Command(BaseCommand):
    help = "Seeds 10 users to the database."

    def handle(self, *args, **kwargs):
        self.stdout.write("... Migrating Old DB to New ...")

        try:
            orgs = client.organizations.list_organizations()
            # print(orgs)
            for org in orgs["data"]:
                for domain in org["domains"]:
                    print("Domain: ", org["id"], domain["domain"] == "foo-corp.com")
                    if domain["domain"] == "foo-corp.com":
                        client.organizations.delete_organization(org["id"])
                        print(f"Deleted organization with ID: {org['id']}")

            response = RequestHelper().request(
                USER_PATH,
                method=REQUEST_METHOD_GET,
                params={},
                token=workos.api_key,
            )

            for user in response["data"]:
                if user["email"] != "mohamed@sintahr.com":
                    client.user_management.delete_user(user["id"])
                    print(f"Deleted user with ID: {user['id']}")
            self.stdout.write("Migration completed.")
        except Exception as e:
            print("Error during migration: ", e)
