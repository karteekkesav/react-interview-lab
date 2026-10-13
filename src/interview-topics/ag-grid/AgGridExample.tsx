import { useEffect, useMemo, useState } from 'react'
import {
  AllCommunityModule,
  type CellContextMenuEvent,
  type ColDef,
  type RowClassParams,
  type SelectionChangedEvent,
  type ValueFormatterParams,
  themeQuartz,
} from 'ag-grid-community'
import { AgGridProvider, AgGridReact } from 'ag-grid-react'

type Transaction = {
  id: number
  customer: string
  accountType: 'Savings' | 'Current' | 'NRI'
  amount: number
  status: 'Completed' | 'Pending' | 'Failed'
  risk: 'Low' | 'Medium' | 'High'
}

type ChartType = 'bar' | 'status'

type ChartMenuPosition = {
  x: number
  y: number
}

const modules = [AllCommunityModule]

const transactions: Transaction[] = [
  {
    id: 1001,
    customer: 'Karteek Kesav',
    accountType: 'Savings',
    amount: 12450,
    status: 'Completed',
    risk: 'Low',
  },
  {
    id: 1002,
    customer: 'Asha Rao',
    accountType: 'Current',
    amount: 98500,
    status: 'Pending',
    risk: 'Medium',
  },
  {
    id: 1003,
    customer: 'Rahul Mehta',
    accountType: 'NRI',
    amount: 245000,
    status: 'Failed',
    risk: 'High',
  },
  {
    id: 1004,
    customer: 'Priya Nair',
    accountType: 'Savings',
    amount: 7400,
    status: 'Completed',
    risk: 'Low',
  },
  {
    id: 1005,
    customer: 'Vikram Shah',
    accountType: 'Current',
    amount: 42000,
    status: 'Completed',
    risk: 'Medium',
  },
  {
    id: 1006,
    customer: 'Neha Iyer',
    accountType: 'NRI',
    amount: 120000,
    status: 'Pending',
    risk: 'High',
  },
  {
    id: 1007,
    customer: 'Sanjay Kumar',
    accountType: 'Savings',
    amount: 18300,
    status: 'Completed',
    risk: 'Low',
  },
  {
    id: 1008,
    customer: 'Meera Joshi',
    accountType: 'Current',
    amount: 67500,
    status: 'Pending',
    risk: 'Medium',
  },
  {
    id: 1009,
    customer: 'Farhan Ali',
    accountType: 'NRI',
    amount: 315000,
    status: 'Failed',
    risk: 'High',
  },
  {
    id: 1010,
    customer: 'Divya Menon',
    accountType: 'Savings',
    amount: 9500,
    status: 'Completed',
    risk: 'Low',
  },
  {
    id: 1011,
    customer: 'Arjun Reddy',
    accountType: 'Current',
    amount: 88000,
    status: 'Completed',
    risk: 'Medium',
  },
  {
    id: 1012,
    customer: 'Sneha Kapoor',
    accountType: 'NRI',
    amount: 176000,
    status: 'Pending',
    risk: 'High',
  },
  {
    id: 1013,
    customer: 'Manoj Patel',
    accountType: 'Savings',
    amount: 22100,
    status: 'Completed',
    risk: 'Low',
  },
  {
    id: 1014,
    customer: 'Ishita Das',
    accountType: 'Current',
    amount: 54000,
    status: 'Failed',
    risk: 'Medium',
  },
  {
    id: 1015,
    customer: 'Nikhil Verma',
    accountType: 'NRI',
    amount: 260000,
    status: 'Completed',
    risk: 'High',
  },
  {
    id: 1016,
    customer: 'Pooja Sharma',
    accountType: 'Savings',
    amount: 15100,
    status: 'Pending',
    risk: 'Low',
  },
  {
    id: 1017,
    customer: 'Rohit Bansal',
    accountType: 'Current',
    amount: 132000,
    status: 'Completed',
    risk: 'Medium',
  },
  {
    id: 1018,
    customer: 'Ananya Gupta',
    accountType: 'NRI',
    amount: 410000,
    status: 'Failed',
    risk: 'High',
  },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function StatusBadge({ value }: { value: Transaction['status'] }) {
  return <span className={`grid-badge ${value.toLowerCase()}`}>{value}</span>
}

export default function AgGridExample() {
  const [quickFilterText, setQuickFilterText] = useState('')
  const [selectedRows, setSelectedRows] = useState<Transaction[]>([])
  const [chartType, setChartType] = useState<ChartType | null>(null)
  const [chartMenuPosition, setChartMenuPosition] =
    useState<ChartMenuPosition | null>(null)

  const rowData = useMemo(() => transactions, [])

  const columnDefs = useMemo<ColDef<Transaction>[]>(
    () => [
      {
        field: 'id',
        headerName: 'Txn ID',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 122,
      },
      { field: 'customer', flex: 1.3, minWidth: 170 },
      {
        field: 'accountType',
        headerName: 'Account',
        filter: 'agSetColumnFilter',
        width: 145,
      },
      {
        field: 'amount',
        sort: 'desc',
        width: 150,
        valueFormatter: (params: ValueFormatterParams<Transaction, number>) =>
          formatCurrency(params.value ?? 0),
      },
      {
        field: 'status',
        filter: 'agSetColumnFilter',
        cellRenderer: StatusBadge,
        width: 150,
      },
      { field: 'risk', filter: 'agSetColumnFilter', width: 125 },
    ],
    [],
  )

  const defaultColDef = useMemo<ColDef<Transaction>>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: true,
      minWidth: 120,
    }),
    [],
  )

  const rowSelection = useMemo(
    () => ({
      mode: 'multiRow' as const,
    }),
    [],
  )

  const getRowClass = useMemo(
    () => (params: RowClassParams<Transaction>) =>
      params.node.rowIndex != null && params.node.rowIndex % 2 === 0
        ? 'ag-row-even-custom'
        : 'ag-row-odd-custom',
    [],
  )

  function handleSelectionChanged(event: SelectionChangedEvent<Transaction>) {
    setSelectedRows(event.api.getSelectedRows())
  }

  function handleCellContextMenu(event: CellContextMenuEvent<Transaction>) {
    event.event?.preventDefault()

    const mouseEvent = event.event as MouseEvent | undefined

    if (!mouseEvent) return

    setChartMenuPosition({
      x: mouseEvent.clientX,
      y: mouseEvent.clientY,
    })
  }

  function handleChooseChart(nextChartType: ChartType) {
    setChartType(nextChartType)
    setChartMenuPosition(null)
  }

  const maxSelectedAmount = Math.max(
    1,
    ...selectedRows.map((row) => row.amount),
  )

  const selectedStatusSummary = useMemo(
    () =>
      selectedRows.reduce<Record<Transaction['status'], number>>(
        (summary, row) => ({
          ...summary,
          [row.status]: summary[row.status] + 1,
        }),
        {
          Completed: 0,
          Pending: 0,
          Failed: 0,
        },
      ),
    [selectedRows],
  )

  const maxStatusCount = Math.max(1, ...Object.values(selectedStatusSummary))

  useEffect(() => {
    function closeMenu() {
      setChartMenuPosition(null)
    }

    function closeMenuOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') closeMenu()
    }

    window.addEventListener('click', closeMenu)
    window.addEventListener('keydown', closeMenuOnEscape)

    return () => {
      window.removeEventListener('click', closeMenu)
      window.removeEventListener('keydown', closeMenuOnEscape)
    }
  }, [])

  return (
    <div className="demo-stack">
      <div className="demo-card">
        <div>
          <h3>AG Grid React Demo</h3>
          <p>
            Real AG Grid example with sorting, filtering, quick search,
            pagination, row selection, value formatting, and custom cell UI.
          </p>
        </div>
        <strong>{selectedRows.length} selected</strong>
      </div>

      <label className="grid-search">
        Quick filter
        <input
          value={quickFilterText}
          onChange={(event) => setQuickFilterText(event.target.value)}
          placeholder="Search customer, account, status, risk"
        />
      </label>

      <section className="chart-panel" aria-labelledby="selected-chart-title">
        <div>
          <p className="eyebrow">Selected row chart</p>
          <h3 id="selected-chart-title">
            {chartType === 'status'
              ? 'Selected Status Summary'
              : 'Selected Transaction Amounts'}
          </h3>
          <p>
            Select rows, right-click inside the grid, then choose a chart type.
          </p>
        </div>

        {selectedRows.length === 0 ? (
          <p role="status">Select one or more rows to generate a chart.</p>
        ) : chartType === null ? (
          <p role="status">
            Right-click the grid and choose Bar Chart or Status Summary.
          </p>
        ) : chartType === 'bar' ? (
          <div className="selected-bar-chart">
            {selectedRows.map((row) => (
              <div className="bar-row" key={row.id}>
                <span>{row.customer}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${Math.max(8, (row.amount / maxSelectedAmount) * 100)}%`,
                    }}
                  />
                </div>
                <strong>{formatCurrency(row.amount)}</strong>
              </div>
            ))}
          </div>
        ) : (
          <div className="selected-bar-chart">
            {Object.entries(selectedStatusSummary).map(([status, count]) => (
              <div className="bar-row" key={status}>
                <span>{status}</span>
                <div className="bar-track">
                  <div
                    className={`bar-fill status-${status.toLowerCase()}`}
                    style={{
                      width: `${Math.max(8, (count / maxStatusCount) * 100)}%`,
                    }}
                  />
                </div>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        )}
      </section>

      <AgGridProvider modules={modules}>
        <div className="ag-grid-demo">
          <AgGridReact<Transaction>
            theme={themeQuartz}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            quickFilterText={quickFilterText}
            pagination={true}
            paginationPageSize={8}
            paginationPageSizeSelector={[8, 12, 18]}
            rowSelection={rowSelection}
            getRowClass={getRowClass}
            onCellContextMenu={handleCellContextMenu}
            onSelectionChanged={handleSelectionChanged}
          />
        </div>
      </AgGridProvider>

      {chartMenuPosition ? (
        <div
          className="grid-context-menu"
          style={{
            left: chartMenuPosition.x,
            top: chartMenuPosition.y,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <span>Chart selected rows</span>
          <button
            type="button"
            disabled={selectedRows.length === 0}
            onClick={() => handleChooseChart('bar')}
          >
            Bar Chart
          </button>
          <button
            type="button"
            disabled={selectedRows.length === 0}
            onClick={() => handleChooseChart('status')}
          >
            Status Summary
          </button>
          {selectedRows.length === 0 ? (
            <small>Select rows first</small>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
