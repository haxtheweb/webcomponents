# EditableTable

Table-based data for the web.

- Package `@haxtheweb/editable-table` 26.8.0
- HAX block "Table" (Instructional, presentation, table, data, layout)

## Usage

```html
<div class="buttons">
              <button 
                id="food-button" 
                aria-pressed="false"
                controls="food-table" 
                onclick="toggleEditMode()">
                Toggle Edit Mode 
              </button>
            </div>
            <editable-table 
              id="food-table" 
              bordered 
              condensed 
              filter 
              printable
              responsive
              sort 
              striped>
                <table>
                  <caption>
                    Is it a <em>sandwich</em>? Food classification chart.
                  </caption>
                  <thead>
                    <tr>
                      <th scope="row">Food</th>
                      <th scope="col">Enclosure</th>
                      <th scope="col">Contents</th>
                      <th scope="col">Orientation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Hamburger</th>
                      <td>one bun, split into two</td>
                      <td>meat, vegetables, cheese, <i>and/or</i> condiments</td>
                      <td>horizontal</td>
                    </tr>
                    <tr>
                      <th scope="row">Hoagie</th>
                      <td>one bun</td>
                      <td>meat, vegetables, cheese, <i>and/or</i> condiments</td>
                      <td>vertical</td>
                    </tr>
                    <tr>
                      <th scope="row">Hot Dog</th>
                      <td>one bun</td>
                      <td>meat, vegetables, cheese, <i>and/or</i> condiments</td>
                      <td>vertical</td>
                    </tr>
                    <tr>
                      <th scope="row">Hot Pocket</th>
                      <td>two crusts sealed together</td>
                      <td>meat, vegetables, cheese, <i>and/or</i> condiments</td>
                      <td>horizontal</td>
                    </tr>
                    <tr>
                      <th scope="row">Pie</th>
                      <td>two crusts sealed together</td>
                      <td>fruit or meat, vegetables, <i>and/or</i> cheese</td>
                      <td>horizontal</td>
                    </tr>
                    <tr>
                      <th scope="row">Taco</th>
                      <td>one shell</td>
                      <td>meat, vegetables, cheese, <i>and/or</i> condiments</td>
                      <td>vertical</td>
                    </tr>
                  </tbody>
                </table>
            </editable-table>
```

## The consumer provides

| Attribute / slot | Label | What it does | HAX input |
|---|---|---|---|
| `row-header` | Row Header | Treat first row as a header. | boolean |
| `column-header` | Column Header | Treat first column as a header. | boolean |
| `footer` | Footer | Treat last row as a footer. | boolean |
| `sort` | Sortable | Allow sorting by column values. | boolean |
| `filter` | Allow Filter | Allow filtering by column values. | boolean |
| `numeric-styles` | Numeric Styling | Apply numeric styling to numeric columns. | boolean |
| `responsive` | Responsive | Adjust table layout on small screens. | boolean |
| `rubric-mode` | Rubric Mode | Interpret this table as an OER Schema Rubric so that Rubric, RubricScale, RubricCriterion, and RubricLevel metadata is emitted. | boolean |
| `rubric-type` | Rubric Type | Rubric style emitted as oer:rubricType (only meaningful when Rubric Mode is on). | select |
| `bordered` | Bordered |  | boolean (advanced) |
| `condensed` | Condense Rows | Reduce row height. | boolean (advanced) |
| `striped` | Striped Rows | Shade every other row. | boolean (advanced) |
| `downloadable` | Download Button | Add a button to download the table. | boolean (advanced) |
| `copyable` | Copy Button | Add a button to copy table CSV data. | boolean (advanced) |
| `printable` | Print Button | Add a button to print only the table. | boolean (advanced) |

## DDD usage

Its source references 15 distinct design-system variables. By family: theme (34), spacing (11), icon (4), font (2), simple-colors (2), border (1). Most used: `--ddd-theme-default-coalyGray`, `--ddd-theme-default-white`, `--ddd-theme-default-limestoneMaxLight`, `--ddd-icon-xxs`, `--ddd-spacing-1`, `--ddd-spacing-4`.
