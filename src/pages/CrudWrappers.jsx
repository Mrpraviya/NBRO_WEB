import EntityCrudPage from "./EntityCrudPage";

const siteFields = [
  { key: "owner_name", label: "Owner name" },
  { key: "address", label: "Address" },
  { key: "building_ref", label: "Building ref", primary: true },
  { key: "latitude", label: "Latitude", type: "number" },
  { key: "longitude", label: "Longitude", type: "number" },
  { key: "sync_status", label: "Sync status", type: "select", options: [
    { value: "pending", label: "Pending" },
    { value: "syncing", label: "Syncing" },
    { value: "synced", label: "Synced" },
    { value: "error", label: "Error" },
  ] },
  { key: "sections_status", label: "Sections status", type: "textarea", fullWidth: true },
];

const siteData = [
  {
    site_id: "f5c7d8bb-6e1a-4d5b-8fa2-37c9a3a6d01e",
    owner_name: "Amina Yusuf",
    address: "12 Harbour Road, Lagos",
    building_ref: "NBRO-001",
    latitude: 6.5244,
    longitude: 3.3792,
    sync_status: "synced",
    sections_status: { general_observation: true, external_services: true, main_building: true, ancillary_building: false, defects: true },
  },
  {
    site_id: "85d7203d-8d8d-4cb2-9f45-c1f4434b4eb0",
    owner_name: "John Okafor",
    address: "88 River Avenue, Abuja",
    building_ref: "NBRO-025",
    latitude: 9.0765,
    longitude: 7.3986,
    sync_status: "syncing",
    sections_status: { general_observation: true, external_services: false, main_building: true, ancillary_building: true, defects: false },
  },
];

const profileFields = [
  { key: "full_name", label: "Full name", primary: true },
  { key: "role", label: "Role", type: "select", options: [
    { value: "admin", label: "Admin" },
    { value: "officer", label: "Officer" },
  ] },
  { key: "is_active", label: "Active", type: "boolean" },
  { key: "must_change_password", label: "Password reset required", type: "boolean" },
  { key: "created_at", label: "Created at", type: "datetime-local" },
];

const profileData = [
  {
    id: "a1013d0c-5b17-42da-a2e6-59d40595a9dc",
    full_name: "Nneka Ajayi",
    role: "admin",
    is_active: true,
    must_change_password: false,
    created_at: "2024-08-12T09:15",
  },
  {
    id: "7e82ac31-0ccf-4ae6-9557-d0dd4fe6f942",
    full_name: "Musa Ibrahim",
    role: "officer",
    is_active: true,
    must_change_password: true,
    created_at: "2024-11-02T10:00",
  },
];

const noticeFields = [
  { key: "title", label: "Title", primary: true },
  { key: "priority", label: "Priority", type: "select", options: [
    { value: "urgent", label: "Urgent" },
    { value: "high", label: "High" },
    { value: "normal", label: "Normal" },
    { value: "low", label: "Low" },
  ] },
  { key: "target_type", label: "Target type", type: "select", options: [
    { value: "all", label: "All" },
    { value: "individual", label: "Individual" },
    { value: "selected", label: "Selected" },
  ] },
  { key: "published_by_name", label: "Published by" },
  { key: "published_at", label: "Published at", type: "datetime-local" },
  { key: "message", label: "Message", type: "textarea", fullWidth: true },
];

const noticeData = [
  {
    id: "d3f2f3d8-0e2a-42c8-b38d-c9c13f130a60",
    title: "Quarterly inspection review",
    priority: "high",
    target_type: "all",
    published_by_name: "Nneka Ajayi",
    published_at: "2024-11-15T08:30",
    message: "All inspection officers are required to submit the Q4 review package before Friday.",
  },
];

const defectFields = [
  { key: "notation", label: "Notation", primary: true },
  { key: "defect_category", label: "Category" },
  { key: "floor_level", label: "Floor level" },
  { key: "location_description", label: "Location" },
  { key: "length_mm", label: "Length (mm)", type: "number" },
  { key: "width_mm", label: "Width (mm)", type: "number" },
  { key: "sync_status", label: "Sync status", type: "select", options: [
    { value: "pending", label: "Pending" },
    { value: "syncing", label: "Syncing" },
    { value: "synced", label: "Synced" },
    { value: "error", label: "Error" },
  ] },
  { key: "remarks", label: "Remarks", type: "textarea", fullWidth: true },
];

const defectData = [
  {
    defect_id: "3e0a6f5c-7b5c-4ea5-838a-dbd6d27b0c4a",
    notation: "CR-03",
    defect_category: "Crack",
    floor_level: "Ground floor",
    location_description: "Rear left wall",
    length_mm: 2100,
    width_mm: 120,
    remarks: "Vertical crack, moisture staining present",
    sync_status: "synced",
  },
];

const inspectionFields = [
  { key: "site_ref", label: "Site ref", primary: true },
  { key: "no_floors", label: "Floors" },
  { key: "element_type", label: "Element type" },
  { key: "sync_status", label: "Sync status", type: "select", options: [
    { value: "pending", label: "Pending" },
    { value: "syncing", label: "Syncing" },
    { value: "synced", label: "Synced" },
    { value: "error", label: "Error" },
  ] },
  { key: "is_used", label: "Used in structure", type: "boolean" },
  { key: "floor_details", label: "Floor details", type: "textarea", fullWidth: true },
];

const inspectionData = [
  {
    building_id: "91f0a96b-3f36-4bf1-8dcb-6ac21d86efed",
    site_ref: "NBRO-001",
    no_floors: "3 floors",
    sync_status: "synced",
    element_type: "Beam",
    is_used: true,
    floor_details: JSON.stringify({ "Ground floor": "Concrete frame", "First floor": "Reinforced slab" }, null, 2),
  },
];

const siteEmpty = {
  site_id: "",
  owner_name: "",
  address: "",
  building_ref: "",
  latitude: "",
  longitude: "",
  sync_status: "pending",
  sections_status: "{\n  \"general_observation\": true\n}",
};

const profileEmpty = {
  id: "",
  full_name: "",
  role: "officer",
  is_active: true,
  must_change_password: false,
  created_at: "",
};

const noticeEmpty = {
  id: "",
  title: "",
  priority: "normal",
  target_type: "all",
  published_by_name: "",
  published_at: "",
  message: "",
};

const defectEmpty = {
  defect_id: "",
  notation: "",
  defect_category: "",
  floor_level: "",
  location_description: "",
  length_mm: "",
  width_mm: "",
  sync_status: "pending",
  remarks: "",
};

const inspectionEmpty = {
  building_id: "",
  site_ref: "",
  no_floors: "",
  sync_status: "pending",
  element_type: "",
  is_used: true,
  floor_details: "{\n  \"Ground floor\": \"\"\n}",
};

export function SiteCrudPage() {
  return <EntityCrudPage entityKey="site" title="Site" pluralLabel="Sites" listData={siteData} fields={siteFields} emptyItem={siteEmpty} toRoute="/sites" tableColumns={["building_ref", "owner_name", "address", "sync_status"]} />;
}

export function ProfileCrudPage() {
  return <EntityCrudPage entityKey="profile" title="Profile" pluralLabel="Profiles" listData={profileData} fields={profileFields} emptyItem={profileEmpty} toRoute="/profiles" tableColumns={["full_name", "role", "is_active", "must_change_password"]} />;
}

export function NoticeCrudPage() {
  return <EntityCrudPage entityKey="notice" title="Notice" pluralLabel="Notices" listData={noticeData} fields={noticeFields} emptyItem={noticeEmpty} toRoute="/notices" tableColumns={["title", "priority", "target_type", "published_by_name"]} />;
}

export function DefectCrudPage() {
  return <EntityCrudPage entityKey="defect" title="Defect" pluralLabel="Defects" listData={defectData} fields={defectFields} emptyItem={defectEmpty} toRoute="/defects" tableColumns={["notation", "defect_category", "floor_level", "sync_status"]} />;
}

export function InspectionCrudPage() {
  return <EntityCrudPage entityKey="inspection" title="Inspection record" pluralLabel="Inspection records" listData={inspectionData} fields={inspectionFields} emptyItem={inspectionEmpty} toRoute="/inspection" tableColumns={["site_ref", "element_type", "no_floors", "sync_status"]} />;
}
