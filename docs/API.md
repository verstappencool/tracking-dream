## API Endpoints

### Projects

`{{base_url}}/projects`

- Returns all projects with episodes and milestones
- Used by: `/live-v2` page

### Episodes

`{{base_url}}/episodes?project_id=2`

- Returns episodes for a specific project
- Used by: Data transformation layer

### Milestones

`{{base_url}}/milestones?project_id=2`

- Returns milestones/tasks for a specific project
- Used by: Progress calculation

## API Integration

### Files Created:

- `lib/api/projects.ts` - API service functions
- `lib/api/transformers.ts` - Data transformation (API → TVProject)
- `lib/use-api-projects.ts` - Custom hook with auto-refresh

### Data Flow:

```
API → fetchProjects() → transformApiDataToTVProjects() → TVProject[] → UI Components
```

### Status Mapping:

- `"Scripting"` → `"pre-produksi"`
- `"Filming"` → `"shooting"`
- `"Editing"` → `"editing"`
- `"Completed"` → `"selesai"`
- `"Payment"` → `"payment"`

### Progress Calculation:

Progress % = (Done Milestones / Total Milestones) × 100
