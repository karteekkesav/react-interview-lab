# AG Grid In React

AG Grid is a powerful data grid library used for enterprise tables, dashboards, admin panels, banking screens, reporting tools, and large datasets.

This topic's runnable example uses the real `ag-grid-react` library with AG Grid Community features.

Official docs:

- React installation: https://www.ag-grid.com/react-data-grid/installation/
- Creating a basic grid: https://www.ag-grid.com/react-data-grid/deep-dive/
- Column options: https://www.ag-grid.com/react-data-grid/column-properties/
- Sorting: https://www.ag-grid.com/react-data-grid/row-sorting/
- Pagination: https://www.ag-grid.com/react-data-grid/row-pagination/
- Themes: https://www.ag-grid.com/react-data-grid/themes/

## Mental Model

```text
React component
  |
  +-- rowData
  |     |
  |     +-- actual records displayed in table
  |
  +-- columnDefs
  |     |
  |     +-- column configuration
  |
  +-- defaultColDef
  |     |
  |     +-- common settings for all columns
  |
  +-- grid options
        |
        +-- sorting, filtering, pagination, selection, editing
```

Interview answer:

AG Grid separates table data from table configuration. `rowData` is the array of records. `columnDefs` defines how each column should behave. Grid options enable features like sorting, filtering, pagination, row selection, editing, and custom rendering.

## When To Use AG Grid

Use AG Grid when the table needs enterprise-level functionality.

Good use cases:

- banking transaction dashboard
- customer management dashboard
- POI/POA document review queue
- reporting screen
- audit logs
- admin panel
- large sortable/filterable datasets
- editable spreadsheet-like UI

Avoid AG Grid for very small tables where normal HTML table is enough.

```text
Simple 5-row table
  |
  +-- normal table is enough

Large dashboard table
  |
  +-- AG Grid is useful
```

## Installation

Modern AG Grid React installation:

```text
npm install ag-grid-react
```

This also installs `ag-grid-community`.

Enterprise features:

```text
npm install ag-grid-enterprise
```

Important:

```text
ag-grid-react and ag-grid-enterprise versions should match.
Enterprise features require a license for production.
```

## Basic React Setup

AG Grid's current docs use modules and `AgGridProvider`.

```jsx
import { useMemo, useState } from "react"
import { AllCommunityModule, themeQuartz } from "ag-grid-community"
import { AgGridProvider, AgGridReact } from "ag-grid-react"

const modules = [AllCommunityModule]

function UsersGrid() {
  const [rowData] = useState([
    { id: 1, name: "Karteek", role: "Admin" },
    { id: 2, name: "Asha", role: "Reviewer" },
  ])

  const [columnDefs] = useState([
    { field: "id" },
    { field: "name" },
    { field: "role" },
  ])

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    [],
  )

  return (
    <AgGridProvider modules={modules}>
      <div style={{ height: 400 }}>
        <AgGridReact
          theme={themeQuartz}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
      </div>
    </AgGridProvider>
  )
}
```

Flow:

```text
rowData
  |
  v
AG Grid reads rows

columnDefs
  |
  v
AG Grid creates columns

defaultColDef
  |
  v
AG Grid applies common column behavior
```

Interview answer:

To configure AG Grid in React, I install `ag-grid-react`, register the required modules, wrap the grid with `AgGridProvider`, pass `rowData`, `columnDefs`, and `defaultColDef`, and give the grid container a height.

## rowData

`rowData` is the array of objects displayed in the grid.

```jsx
const rowData = [
  {
    id: 1001,
    customer: "Karteek Kesav",
    accountType: "Savings",
    amount: 12450,
    status: "Completed",
  },
]
```

Each object is one row.

```text
rowData[0]
  |
  +-- first table row
```

## columnDefs

`columnDefs` defines the columns.

```jsx
const columnDefs = [
  { field: "id", headerName: "Transaction ID" },
  { field: "customer", headerName: "Customer" },
  { field: "amount", headerName: "Amount" },
  { field: "status", headerName: "Status" },
]
```

Meaning:

```text
field
  |
  +-- property name from rowData

headerName
  |
  +-- label shown in column header
```

Example:

```jsx
{ field: "customer" }
```

AG Grid reads:

```js
row.customer
```

## defaultColDef

`defaultColDef` applies common behavior to all columns.

```jsx
const defaultColDef = useMemo(
  () => ({
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  }),
  [],
)
```

```text
sortable
  |
  +-- user can sort by clicking header

filter
  |
  +-- user can filter rows

resizable
  |
  +-- user can resize columns

flex
  |
  +-- columns share available width
```

Interview answer:

I use `defaultColDef` to avoid repeating the same settings in every column. If most columns should be sortable, filterable, and resizable, I put those options in `defaultColDef`.

## Sorting

Sorting is enabled by default in AG Grid, but it can also be controlled per column.

```jsx
const columnDefs = [
  { field: "customer", sortable: true },
  { field: "amount", sortable: true },
  { field: "notes", sortable: false },
]
```

Initial sort:

```jsx
const columnDefs = [
  { field: "amount", sort: "desc" },
]
```

Interview answer:

Sorting lets users order rows by a column. In dashboards, sorting by date, amount, risk score, or status is very common.

## Filtering

Enable filters:

```jsx
const defaultColDef = {
  filter: true,
}
```

Per column filter:

```jsx
const columnDefs = [
  { field: "customer", filter: "agTextColumnFilter" },
  { field: "amount", filter: "agNumberColumnFilter" },
  { field: "status", filter: "agSetColumnFilter" },
]
```

Quick filter:

```jsx
const [quickFilterText, setQuickFilterText] = useState("")

return (
  <>
    <input
      value={quickFilterText}
      onChange={(event) => setQuickFilterText(event.target.value)}
      placeholder="Search rows"
    />

    <AgGridReact quickFilterText={quickFilterText} />
  </>
)
```

Interview answer:

Column filters are useful when users need precise filtering per column. Quick filter is useful for global search across visible row values.

## Pagination

Enable pagination:

```jsx
<AgGridReact
  rowData={rowData}
  columnDefs={columnDefs}
  pagination={true}
  paginationPageSize={10}
  paginationPageSizeSelector={[10, 25, 50]}
/>
```

Flow:

```text
Large rowData
  |
  v
AG Grid splits rows into pages
  |
  v
User navigates page 1, 2, 3
```

Interview answer:

Pagination improves usability when users need to scan data page by page. For very large backend datasets, server-side pagination is better than loading all rows into the browser.

## Row Selection

Row selection allows users to select one or more rows.

```jsx
const rowSelection = useMemo(
  () => ({
    mode: "multiRow",
  }),
  [],
)

<AgGridReact rowSelection={rowSelection} />
```

Selection event:

```jsx
function handleSelectionChanged(event) {
  const selectedRows = event.api.getSelectedRows()
  console.log(selectedRows)
}

<AgGridReact onSelectionChanged={handleSelectionChanged} />
```

Use cases:

- approve selected documents
- export selected transactions
- assign selected customers
- bulk update records

## Charts From Selected AG Grid Rows

Yes, we can create charts from selected AG Grid data.

There are two common approaches:

```text
Approach 1: AG Grid Integrated Charts
  |
  +-- built into AG Grid Enterprise
  +-- users can create charts from grid ranges
  +-- needs Enterprise package/license

Approach 2: React chart from selected rows
  |
  +-- works with AG Grid Community
  +-- use onSelectionChanged
  +-- read selected rows
  +-- render chart using React, SVG, CSS, Recharts, Chart.js, etc.
```

This project uses approach 2 so the example works without an Enterprise license.

Visual flow:

```text
User selects rows in AG Grid
  |
  v
onSelectionChanged fires
  |
  v
event.api.getSelectedRows()
  |
  v
React state stores selected rows
  |
  v
Chart renders from selected row data
```

Example:

```jsx
const [selectedRows, setSelectedRows] = useState([])

function handleSelectionChanged(event) {
  setSelectedRows(event.api.getSelectedRows())
}

<AgGridReact
  rowSelection={{ mode: "multiRow" }}
  onSelectionChanged={handleSelectionChanged}
/>
```

Then render a chart:

```jsx
function SelectedAmountChart({ selectedRows }) {
  const maxAmount = Math.max(1, ...selectedRows.map((row) => row.amount))

  if (selectedRows.length === 0) {
    return <p>Select rows to generate chart.</p>
  }

  return (
    <div>
      {selectedRows.map((row) => (
        <div key={row.id}>
          <span>{row.customer}</span>
          <div
            style={{
              width: `${(row.amount / maxAmount) * 100}%`,
              height: 12,
              background: "#2563eb",
            }}
          />
          <strong>{row.amount}</strong>
        </div>
      ))}
    </div>
  )
}
```

Dashboard-style use case:

```text
Selected transactions
  |
  +-- customer
  +-- amount
  +-- risk
  +-- status
  |
  v
Chart
  |
  +-- compare selected transaction amounts
  +-- identify high-value rows
  +-- summarize selected records
```

Real banking example:

```text
Reviewer selects 5 transactions
  |
  v
Chart shows amount by customer
  |
  v
Reviewer quickly sees which selected transaction has highest value
```

Interview answer:

AG Grid selection data can be used to drive charts. If the project has AG Grid Enterprise, Integrated Charts can generate charts directly from grid ranges. If the project uses Community edition, I can listen to `onSelectionChanged`, store `event.api.getSelectedRows()` in React state, and render a custom chart with React or any charting library.

## Right-Click Chart Menu For Selected Rows

A common dashboard requirement is:

```text
User selects rows
  |
  v
User right-clicks grid
  |
  v
Menu opens with chart options
  |
  v
User chooses chart type
  |
  v
Chart appears above grid
```

In AG Grid Community, we can implement this with:

- row selection
- `onSelectionChanged`
- `onCellContextMenu`
- React state for chart type
- React state for menu position

Example state:

```jsx
const [selectedRows, setSelectedRows] = useState([])
const [chartType, setChartType] = useState(null)
const [chartMenuPosition, setChartMenuPosition] = useState(null)
```

Selection handler:

```jsx
function handleSelectionChanged(event) {
  setSelectedRows(event.api.getSelectedRows())
}
```

Right-click handler:

```jsx
function handleCellContextMenu(event) {
  event.event?.preventDefault()

  setChartMenuPosition({
    x: event.event.clientX,
    y: event.event.clientY,
  })
}
```

Grid usage:

```jsx
<AgGridReact
  rowSelection={{ mode: "multiRow" }}
  onSelectionChanged={handleSelectionChanged}
  onCellContextMenu={handleCellContextMenu}
/>
```

Custom chart menu:

```jsx
{chartMenuPosition && (
  <div
    className="grid-context-menu"
    style={{
      left: chartMenuPosition.x,
      top: chartMenuPosition.y,
    }}
  >
    <button onClick={() => setChartType("bar")}>Bar Chart</button>
    <button onClick={() => setChartType("status")}>Status Summary</button>
  </div>
)}
```

Chart above grid:

```jsx
{chartType === "bar" && (
  <SelectedAmountChart selectedRows={selectedRows} />
)}
```

Interview answer:

For Community edition, I can build a custom right-click menu using `onCellContextMenu`. When the user chooses a chart type, I store the selected chart type in React state and render the chart above the grid using the currently selected rows.

## AG Grid Enterprise Integrated Charts

AG Grid also has built-in Integrated Charts, but this is an Enterprise feature.

Enterprise-style concept:

```text
AG Grid selected/ranged data
  |
  v
Integrated Charts
  |
  +-- bar chart
  +-- line chart
  +-- pie chart
  +-- area chart
```

Interview answer:

If the project has an AG Grid Enterprise license, I would consider Integrated Charts for built-in charting. If the project uses Community edition, I can use selected rows from AG Grid and render charts with React, Chart.js, Recharts, D3, or simple CSS/SVG.

## Filling The First Page Without White Space

If pagination page size is too small and the grid has a fixed height, the first page can show a large blank area.

Problem:

```text
grid height = 420px
page size = 3 rows
  |
  v
only 3 rows render
  |
  v
large white space appears below rows
```

Fix options:

```text
Option 1
  |
  +-- increase paginationPageSize to fill visible rows

Option 2
  |
  +-- use domLayout="autoHeight"
  +-- grid height grows based on rendered rows

Option 3
  |
  +-- use server pagination and set page size based on product requirement
```

Example used in this topic:

```jsx
<AgGridReact
  pagination={true}
  paginationPageSize={8}
  paginationPageSizeSelector={[8, 12, 18]}
/>
```

Why this helps:

```text
more realistic data
  |
  v
8 rows per page
  |
  v
pagination is visible and useful
```

For a polished dashboard grid, use a fixed grid panel height:

```css
.ag-grid-demo {
  height: 560px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 8px;
}
```

This gives the grid a stable dashboard layout while pagination controls stay inside the grid.

```text
fixed grid panel
  |
  v
consistent dashboard layout
  |
  v
pagination handles extra records
```

Interview answer:

To avoid blank space, I align page size with the visible row count and use enough sample/backend data so pagination is meaningful. For dashboard screens, a fixed grid height with pagination usually gives a more stable layout than a grid that constantly changes height.

## Compact Status Badges

Status badges should not make table rows look too tall.

Good badge style:

```css
.grid-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  height: 28px;
  padding: 0 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
}
```

Why:

```text
fixed badge height
  |
  v
badge aligns vertically in cell
  |
  v
row height stays consistent
```

Interview answer:

For status columns, I prefer compact badges with fixed height and centered alignment. This keeps rows readable without making one column visually heavier than the rest of the grid.

## Improving Grid Look And Feel

Polish checklist:

```text
bordered grid container
subtle shadow
soft header background
alternating rows
hover row color
selected row color
compact badges
stable column widths
quick filter above grid
```

Example:

```css
.ag-grid-demo .ag-header {
  background: #f8fafc;
}

.ag-grid-demo .ag-row-odd-custom {
  background: #f4f8fc;
}

.ag-grid-demo .ag-row-hover {
  background: #edf6ff;
}
```

Interview answer:

For enterprise dashboards, table polish matters because users scan dense information repeatedly. I improve readability with stable column widths, alternating row colors, compact badges, hover states, and clear pagination.

## Alternating Row Colors

Alternating row colors improve readability.

Visual:

```text
Row 1 -> light color
Row 2 -> slightly different color
Row 3 -> light color
Row 4 -> slightly different color
```

AG Grid implementation:

```jsx
const getRowClass = useMemo(
  () => (params) =>
    params.node.rowIndex % 2 === 0
      ? "ag-row-even-custom"
      : "ag-row-odd-custom",
  [],
)

<AgGridReact getRowClass={getRowClass} />
```

CSS:

```css
.ag-row-even-custom {
  background: #f8fafc;
}

.ag-row-odd-custom {
  background: #eef6ff;
}
```

Interview answer:

I use `getRowClass` or row styling rules to apply alternating row colors. This is useful for tables with many columns because users can scan rows more easily.

## Cell Rendering

Cell renderers customize how a cell appears.

```jsx
const columnDefs = [
  {
    field: "status",
    cellRenderer: (params) => {
      return <strong>{params.value}</strong>
    },
  },
]
```

Status badge example:

```jsx
const columnDefs = [
  {
    field: "status",
    cellRenderer: (params) => (
      <span className={`status status-${params.value.toLowerCase()}`}>
        {params.value}
      </span>
    ),
  },
]
```

Interview answer:

I use cell renderers when raw values need better UI, such as status badges, action buttons, links, icons, risk indicators, or formatted currency.

## Value Formatter

Use `valueFormatter` to format displayed values without changing raw data.

```jsx
const columnDefs = [
  {
    field: "amount",
    valueFormatter: (params) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(params.value),
  },
]
```

```text
raw value
  |
  +-- 12450

display value
  |
  +-- ₹12,450.00
```

Interview answer:

`valueFormatter` is useful for currency, dates, percentages, phone numbers, and labels. The underlying data stays unchanged.

## Editable Cells

Enable editing:

```jsx
const columnDefs = [
  { field: "customer" },
  { field: "status", editable: true },
]
```

Select editor:

```jsx
const columnDefs = [
  {
    field: "status",
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["Completed", "Pending", "Failed"],
    },
  },
]
```

Save changed value:

```jsx
function handleCellValueChanged(event) {
  console.log("Updated row:", event.data)
  console.log("Changed column:", event.colDef.field)
  console.log("New value:", event.newValue)
}

<AgGridReact onCellValueChanged={handleCellValueChanged} />
```

Interview answer:

Editable cells are useful for spreadsheet-like admin screens. I usually validate changes and send updates to the backend using a mutation or API call.

## Action Buttons

Action buttons are common in enterprise tables.

```jsx
const columnDefs = [
  {
    headerName: "Actions",
    cellRenderer: (params) => (
      <button onClick={() => openDetails(params.data.id)}>
        View
      </button>
    ),
  },
]
```

Use cases:

- view details
- edit row
- approve document
- reject document
- download receipt

## Loading And Error States

AG Grid can show data once it is available.

```jsx
function TransactionsGrid() {
  const [rowData, setRowData] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/transactions")
      .then((response) => response.json())
      .then(setRowData)
      .catch(() => setError("Unable to load transactions"))
  }, [])

  if (error) return <p role="alert">{error}</p>

  return <AgGridReact rowData={rowData} columnDefs={columnDefs} />
}
```

Interview answer:

I handle loading, error, empty, and success states around the grid. AG Grid handles display and interactions, but the React component still owns API state.

## Client-Side Vs Server-Side Data

```text
Client-side row model
  |
  +-- frontend loads all rows
  +-- grid sorts/filters/paginates in browser
  +-- good for small to medium datasets

Server-side approach
  |
  +-- backend owns sorting/filtering/pagination
  +-- frontend requests current page/query
  +-- better for huge datasets
```

Interview answer:

For small or medium datasets, client-side AG Grid features are simple and fast. For large banking transaction datasets, I would use backend pagination/sorting/filtering and send only the current page to the browser.

## AG Grid With API Query Parameters

For backend-driven tables:

```text
User changes sort/filter/page
  |
  v
React updates query state
  |
  v
Call API with params
  |
  v
Backend returns rows and total count
  |
  v
AG Grid displays rows
```

Example:

```jsx
async function getTransactions({ page, sortBy, sortDirection, status }) {
  const params = new URLSearchParams({
    page: String(page),
    sortBy,
    sortDirection,
    status,
  })

  const response = await fetch(`/api/transactions?${params}`)
  return response.json()
}
```

## Performance Best Practices

- Keep `columnDefs` stable with `useMemo` or `useState`.
- Keep `defaultColDef` stable with `useMemo`.
- Use stable row IDs when possible.
- Avoid creating heavy cell renderers inline for huge grids.
- Use pagination or server-side loading for large datasets.
- Do not load one year of banking transactions into the browser if the dataset is huge.
- Use value formatters for display-only formatting.
- Use backend sorting/filtering for very large data.

Stable definitions:

```jsx
const columnDefs = useMemo(
  () => [
    { field: "id" },
    { field: "customer" },
    { field: "amount" },
  ],
  [],
)

const defaultColDef = useMemo(
  () => ({
    sortable: true,
    filter: true,
    resizable: true,
  }),
  [],
)
```

## Community Vs Enterprise

```text
AG Grid Community
  |
  +-- sorting
  +-- filtering
  +-- pagination
  +-- row selection
  +-- editing
  +-- themes

AG Grid Enterprise
  |
  +-- row grouping
  +-- aggregation
  +-- pivoting
  +-- Excel export
  +-- advanced filters
  +-- server-side row model
  +-- enterprise support
```

Interview answer:

I would start with Community features if they meet requirements. I would choose Enterprise when the product needs advanced reporting features like grouping, pivoting, Excel export, aggregation, or server-side row model support.

## Resume-Based Example

Banking dashboard:

```text
Transactions grid
  |
  +-- columns: date, account, customer, amount, status, risk
  +-- sorting by amount/date
  +-- filtering by status/risk
  +-- pagination
  +-- row selection for export
  +-- action button for details
```

Onboarding review dashboard:

```text
Document review grid
  |
  +-- customer name
  +-- POI status
  +-- POA status
  +-- liveness status
  +-- reviewer action
  +-- approve/reject buttons
```

## Common Interview Questions

### What is AG Grid?

AG Grid is a React data grid library used to build advanced enterprise tables with sorting, filtering, pagination, selection, editing, custom rendering, and large-data features.

### What are rowData and columnDefs?

`rowData` is the data array. `columnDefs` is the column configuration that tells the grid which fields to show and how each column behaves.

### How do you enable sorting and filtering?

I use `defaultColDef` for common behavior:

```jsx
const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
}
```

### How do you handle large datasets?

For small or medium data, client-side pagination is fine. For huge datasets, I use backend pagination, sorting, and filtering so the browser only receives the current page.

### How do you customize cells?

I use `cellRenderer` for custom UI and `valueFormatter` for display formatting.

### How do you update backend after editing?

I listen to `onCellValueChanged`, validate the new value, then call an API or mutation to persist the update.

## Quick Interview Summary

- AG Grid is useful for enterprise tables and dashboards.
- `rowData` is the rows.
- `columnDefs` is the column configuration.
- `defaultColDef` avoids repeated column settings.
- Use sorting/filtering/pagination for table UX.
- Use `cellRenderer` for custom cell UI.
- Use `valueFormatter` for currency/date display.
- Use server-side data handling for huge datasets.
- Use Community for common features and Enterprise for advanced reporting.
