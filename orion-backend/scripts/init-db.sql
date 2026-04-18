-- =====================================================
--  ORION Backend — Script d'initialisation PostgreSQL
--  Exécuter en tant que superuser PostgreSQL
-- =====================================================

-- 1. Créer l'utilisateur applicatif
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'orion_user') THEN
    CREATE ROLE orion_user WITH LOGIN PASSWORD 'orion_secret_2026';
  END IF;
END
$$;

-- 2. Créer la base de données
SELECT 'CREATE DATABASE orion_signalement OWNER orion_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'orion_signalement');

-- Si la commande SELECT ci-dessus ne fonctionne pas automatiquement,
-- utilisez directement :
-- CREATE DATABASE orion_signalement OWNER orion_user;

-- 3. Accorder les droits
GRANT ALL PRIVILEGES ON DATABASE orion_signalement TO orion_user;

-- =====================================================
--  NOTE : Les tables sont créées automatiquement par
--  TypeORM (synchronize: true) en mode développement.
--
--  En production, utilisez les migrations TypeORM :
--    npx typeorm migration:generate -n InitSchema
--    npx typeorm migration:run
-- =====================================================
