import type { App } from 'vue'
import VChart from 'vue-echarts'
import { use, registerMap } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, RadarChart, MapChart, ScatterChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkPointComponent,
  ToolboxComponent,
  RadarComponent,
  GeoComponent,
  VisualMapComponent,
} from 'echarts/components'
import chinaGeo from 'china-geojson'

export function setupEcharts(app: App) {
  use([
    CanvasRenderer,
    BarChart,
    LineChart,
    PieChart,
    RadarChart,
    MapChart,
    ScatterChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DataZoomComponent,
    MarkLineComponent,
    MarkPointComponent,
    ToolboxComponent,
    RadarComponent,
    GeoComponent,
    VisualMapComponent,
  ])

  registerMap('china', chinaGeo.China as any)
  app.component('VChart', VChart)
}
