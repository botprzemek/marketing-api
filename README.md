basketball management system

multitenant
rbac

email with single token
ldap
oauth
2fa

organizations
    staff
    players
    injuries
    player_injuries 1:n
    player_team_history
    teams
    team_staff 1:n
    team_players 1:n
    training_sessions
    training_sessions_player_attendance
    player_workloads
    biometric_metrics
    conditioning_plans
    nutrition_plans
    medical_clearance_status
    player_contracts
    staff_contracts
    agent_information
    transfer_requests
    salary_tables
    salary_caps
    scouts
    scouting_reports
    prospect_players
    tryouts / evaluations
    leagues
    league_categories
    league_teams 1:n
    tournaments
    tournament_teams 1:n
    matches
    schedules
    match_schedules 1:1
    match_play_by_plays
    match_reports
    match_team_reports
    match_player_reports
    invoices
    facility
    facility_reservations
    facility_equipment
    equipment_maintenance_logs
    media_rights
    press_releases
    audit logs (who changed what)
    password_policies
    roles
    role_change
    permissions
    role_permissions
    conversations
    messages
    conversation_messages
    user accounts
    profiles
    invitations
    announcements
    notifications
    payments
    refunds
    ledger entries
    expense categories
    recurring schedules
    blackout dates
    facility availability schedules
    metrics
    audit_logs
    system_events
    data_access_events
    config_changes
    activity_logs
    migration_records
    maintenance_windows
    support_tickets
    support_ticket_messages
    support_categories
    incidents
    incident_categories
    incident_actions
    incident_timeline_events
    disaster_recovery_tests
    backup_snapshots
    data_retention_policies
    business_continuity_plans
    assets
    asset_owners
    asset_classifications
    asset_lifecycle_records
    access_reviews
    access_grants
    temporary_access_tokens
    delegated_access_rules
    session_logs
    vendors
    vendor_risks
    vendor_contracts
    subprocessor_registry
    data_processing_agreements
    encryption_keys_metadata
    key_rotation_events
    consents
    consent_history
    dsar_requests
    privacy_policies
    data_erasure_schedules
    processing_purposes
    api_keys
    processing_records
    lawful_basis_mapping
    retention_schedules
    data_breaches
    breach_impacted_records
    breach_notification_status
    mfa_methods
    mfa_history
    webauthn_credentials
    trusted_devices
    security_controls_inventory
    network_diagrams metadata
    periodic_security_assessments
    vulnerability_scans
    patch_management_records
    transaction_events
    fraud_signals
    chargeback_records
    payment_provider_logs
    tenants
    tenant_settings
    tenant_themes
    tenant_domains
    tenant_usage
    tenant_billing_subscriptions
    tenant_feature_flags
    tenant_limits
    tenant_isolation_incidents
    seasons
    season_teams
    season_player_registrations
    eligibility_rules
    disciplinary_actions
    player_stats
    team_stats
    advanced_metrics
    shot_charts
    possession_logs
    match_officials
    match_fouls
    timeout_logs
    substitution_logs
    documents
    document_access_policies
    document_versions
    tracing
    slo
    alerts
    alerts_rules
    performance_anomalies