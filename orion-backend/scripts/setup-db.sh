#!/bin/bash
# =====================================================
#  ORION Backend — Configuration PostgreSQL
#  Exécuter avec : sudo bash scripts/setup-db.sh
# =====================================================

set -e

echo "🛡️  ORION — Configuration PostgreSQL"
echo "======================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

DB_USER="orion_user"
DB_PASS="orion_secret_2026"
DB_NAME="orion_signalement"

# 1. Vérifier que PostgreSQL est actif
echo -e "${YELLOW}[1/4]${NC} Vérification de PostgreSQL..."
if systemctl is-active --quiet postgresql; then
    echo -e "  ${GREEN}✅ PostgreSQL est actif.${NC}"
else
    echo -e "  ${RED}❌ PostgreSQL n'est pas actif. Démarrage...${NC}"
    systemctl start postgresql
    echo -e "  ${GREEN}✅ PostgreSQL démarré.${NC}"
fi

# 2. Créer l'utilisateur
echo -e "${YELLOW}[2/4]${NC} Création de l'utilisateur '${DB_USER}'..."
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1; then
    echo -e "  ${GREEN}✅ L'utilisateur '${DB_USER}' existe déjà.${NC}"
else
    sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';"
    echo -e "  ${GREEN}✅ Utilisateur '${DB_USER}' créé.${NC}"
fi

# 3. Créer la base de données
echo -e "${YELLOW}[3/4]${NC} Création de la base '${DB_NAME}'..."
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
    echo -e "  ${GREEN}✅ La base '${DB_NAME}' existe déjà.${NC}"
else
    sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"
    echo -e "  ${GREEN}✅ Base '${DB_NAME}' créée.${NC}"
fi

# 4. Accorder les privilèges
echo -e "${YELLOW}[4/4]${NC} Attribution des privilèges..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"
sudo -u postgres psql -d "${DB_NAME}" -c "GRANT ALL ON SCHEMA public TO ${DB_USER};"
echo -e "  ${GREEN}✅ Privilèges accordés.${NC}"

echo ""
echo "======================================"
echo -e "${GREEN}🎉 Configuration terminée !${NC}"
echo ""
echo "  Base de données : ${DB_NAME}"
echo "  Utilisateur     : ${DB_USER}"
echo "  Mot de passe    : ${DB_PASS}"
echo "  Port            : 5432"
echo ""
echo "  Vous pouvez maintenant lancer le backend :"
echo "    cd orion-backend && npm run start:dev"
echo ""
