#!/bin/bash

# Django Database Snapshot Script

# Function to export data
export_data() {
    echo "Exporting data..."
    python manage.py dumpdata > datadump.json
    echo "Data exported to datadump.json"
}

# Function to import data
import_data() {
    echo "Flushing database..."
    python manage.py flush --no-input

    echo "Importing data..."
    python manage.py loaddata datadump.json

    echo "Applying migrations..."
    python manage.py migrate

    echo "Data imported successfully!"
}

# Main menu
while true; do
    echo "Please select an option:"
    echo "  1) Export data"
    echo "  2) Import data"
    echo "  3) Exit"
    read -p "Option: " OPTION

    case $OPTION in
        1) 
            export_data
            ;;
        2)
            import_data
            ;;
        3)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid option. Please try again."
            ;;
    esac

    # Adding some space for readability
    echo ""
done
