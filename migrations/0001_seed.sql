-- MIGRATION 0001


-- CLEAN UP


DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS identity_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS identities;
DROP TABLE IF EXISTS invites;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS accounts;


-- ACCOUNTS


CREATE TABLE accounts (
    id TEXT PRIMARY KEY,

    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,

    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s','now')),
    updated_at INTEGER NULL,

    CHECK (is_active IN (0, 1))
) STRICT;

INSERT INTO accounts (id, email, password_hash, first_name, last_name, is_active)
VALUES
    ('11111111-0000-0000-0000-000000000001', 'v@nightcity.net', 'df6ec1bda89df68eaa6c6ed535612cce2c8d65bde8caff8a839dec6ecbb89f29203eb00249499a1d3900105a9d75c2c4', 'V', 'V', 1);


-- ORGANIZATIONS


CREATE TABLE organizations (
    id TEXT PRIMARY KEY,

    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,

    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s','now')),
    updated_at INTEGER NULL,

    CHECK (is_active IN (0, 1))
) STRICT;

INSERT INTO organizations (id, name, slug, is_active)
VALUES
    ('22222222-0000-0000-0000-000000000001', 'Arasaka Corporation', 'arasaka-corporation', 1),
    ('22222222-0000-0000-0000-000000000002', 'Militech International', 'militech-international', 1);


-- IDENTITIES


CREATE TABLE identities (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    organization_id TEXT NOT NULL,

    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s','now')),
    updated_at INTEGER NULL,

    CHECK (is_active IN (0, 1)),
    FOREIGN KEY(organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    UNIQUE(account_id, organization_id)
) STRICT;

CREATE INDEX idx_organization_id_on_identities ON identities(account_id);
CREATE INDEX idx_account_id_on_identities ON identities(organization_id);

INSERT INTO identities (id, account_id, organization_id)
VALUES
    ('33333333-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001'),
    ('33333333-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002');


-- REFRESH_TOKENS


CREATE TABLE refresh_tokens (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    organization_id TEXT NOT NULL,
    identity_id TEXT NOT NULL,

    jti_hash TEXT NOT NULL UNIQUE,

    expires_at INTEGER NOT NULL,
    issued_at INTEGER NOT NULL,
    audience TEXT NOT NULL,

    revoked_at INTEGER NULL,
    replaced_by TEXT NULL,

    CHECK (revoked_at IS NULL OR revoked_at > issued_at),
    CHECK (expires_at > issued_at),
    CHECK (audience = 'auth:refresh'),
    FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY(organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY(identity_id) REFERENCES identities(id) ON DELETE CASCADE
) STRICT;

CREATE INDEX idx_account_id_on_refresh_tokens ON refresh_tokens(account_id);
CREATE INDEX idx_organization_id_on_refresh_tokens ON refresh_tokens(organization_id);
CREATE INDEX idx_identity_id_on_refresh_tokens ON refresh_tokens(identity_id);


-- ROLES


CREATE TABLE roles (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,

    name TEXT NOT NULL,
    description TEXT,

    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s','now')),
    updated_at INTEGER NULL,

    CHECK (is_active IN (0, 1)),
    FOREIGN KEY(organization_id) REFERENCES organizations(id) ON DELETE CASCADE,

    UNIQUE(organization_id, name)
) STRICT;

CREATE INDEX idx_organization_id_on_roles ON roles(organization_id);

INSERT INTO roles (id, organization_id, name, description)
VALUES
    ('44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'admin', 'Administrator with full access'),
    ('44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001', 'guest', 'Guest with limited access');


-- IDENTITY ROLES


CREATE TABLE identity_roles (
    identity_id TEXT NOT NULL,
    role_id TEXT NOT NULL,

    PRIMARY KEY(identity_id, role_id),
    FOREIGN KEY(identity_id) REFERENCES identities(id) ON DELETE CASCADE,
    FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE
) WITHOUT ROWID;

CREATE INDEX idx_identity_id_on_identity_roles ON identity_roles(identity_id);
CREATE INDEX idx_role_id_on_identity_roles ON identity_roles(role_id);

INSERT INTO identity_roles (identity_id, role_id)
VALUES
    ('33333333-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001'),
    ('33333333-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000002');


-- PERMISSIONS


CREATE TABLE permissions (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,

    name TEXT NOT NULL,
    description TEXT,

    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER DEFAULT (strftime('%s','now')),
    updated_at INTEGER NULL,

    CHECK (is_active IN (0, 1)),
    FOREIGN KEY(organization_id) REFERENCES organizations(id) ON DELETE CASCADE,

    UNIQUE(organization_id, name)
) STRICT;

CREATE INDEX idx_organization_id_on_permissions ON permissions(organization_id);

INSERT INTO permissions (id, organization_id, name, description)
VALUES
    ('55555555-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'read:organizations', 'Read access to organization'),
    ('55555555-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001', 'write:organizations', 'Write access to organization'),
    ('55555555-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000001', 'update:organizations', 'Update access to organization'),
    ('55555555-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000001', 'remove:organizations', 'Remove access to organization');


-- ROLES PERMISSIONS


CREATE TABLE role_permissions (
    role_id TEXT NOT NULL,
    permission_id TEXT NOT NULL,

    PRIMARY KEY(role_id, permission_id),
    FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY(permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) WITHOUT ROWID;

CREATE INDEX idx_role_id_on_role_permissions ON role_permissions(role_id);
CREATE INDEX idx_permission_id_on_role_permissions ON role_permissions(permission_id);

INSERT INTO role_permissions (role_id, permission_id)
VALUES
    ('44444444-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000001'),
    ('44444444-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000002'),
    ('44444444-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000003'),
    ('44444444-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000004'),
    ('44444444-0000-0000-0000-000000000002', '55555555-0000-0000-0000-000000000001');


-- END OF MIGRATION 0001