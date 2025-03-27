import { Skeleton } from '@mui/material'
import * as Material from '@mui/material'

/**
 * Skeleton component for tables.
 */
const TableSkeleton = ({ rows, columns }: { rows: number; columns: number }) => {
  return (
    <Material.TableContainer>
      <Material.Table>
        <Material.TableHead>
          <Material.TableRow>
            {[...Array(columns)].map((_column, index) => (
              <Material.TableCell key={index}>
                <Skeleton />
              </Material.TableCell>
            ))}
          </Material.TableRow>
        </Material.TableHead>
        <Material.TableBody>
          {[...Array(rows)].map((_row, index) => (
            <Material.TableRow key={index}>
              {[...Array(columns)].map((_column, index) => (
                <Material.TableCell key={index}>
                  <Skeleton />
                </Material.TableCell>
              ))}
            </Material.TableRow>
          ))}
        </Material.TableBody>
      </Material.Table>
    </Material.TableContainer>
  )
}

export default TableSkeleton
