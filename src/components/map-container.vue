<template>
  <div id="container">
    <div class="pos-container" v-if="false">
      <el-button type="primary" @click="hideMap">隐藏热力图</el-button>
      <el-button type="primary" @click="showMap">显示热力图</el-button>
    </div>
  </div>
  <el-dialog v-model="dialogVisible2" title="车站详情" width="1200px" :before-close="handleClose2">
    <el-descriptions title="车站详情" :column="3" border>
      <el-descriptions-item label="当前车站">北京站</el-descriptions-item>
      <el-descriptions-item label="联系人">王某某</el-descriptions-item>
      <el-descriptions-item label="联系方式">138XXXXXXX</el-descriptions-item>
      <el-descriptions-item label="灭火器数量">100个</el-descriptions-item>
      <el-descriptions-item label="抽水泵">2台</el-descriptions-item>
      <el-descriptions-item label="沙袋">10袋</el-descriptions-item>
    </el-descriptions>
    <div>
      <mapItem3></mapItem3>
    </div>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref, shallowRef } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import mapItem3 from './map-item-3.vue'
import bicycle from '../assets/bicycle.png'
import iconimg1 from '../assets/icon1.png'
import iconimg2 from '../assets/icon2.png'
import iconimg3 from '../assets/icon3.png'
window._AMapSecurityConfig = {
    // securityJsCode: "7e5bc09f4481b57e427367314025db90",
  securityJsCode: 'c3242bb3ff48fcc871e2e1d57c35dc00'
}
// 降雨热力图数据
const heatmapData = [
  {
    lng: 116.191031,
    lat: 39.988585,
    count: 10
  },
  {
    lng: 116.389275,
    lat: 39.925818,
    count: 11
  },
  {
    lng: 116.287444,
    lat: 39.810742,
    count: 12
  },
  {
    lng: 116.481707,
    lat: 39.940089,
    count: 13
  },
  {
    lng: 116.410588,
    lat: 39.880172,
    count: 14
  },
  {
    lng: 116.394816,
    lat: 39.91181,
    count: 15
  },
  {
    lng: 116.416002,
    lat: 39.952917,
    count: 16
  },
  {
    lng: 116.39671,
    lat: 39.924903,
    count: 17
  },
  {
    lng: 116.180816,
    lat: 39.957553,
    count: 18
  },
  {
    lng: 116.382035,
    lat: 39.874114,
    count: 19
  },
  {
    lng: 116.316648,
    lat: 39.914529,
    count: 20
  },
  {
    lng: 116.395803,
    lat: 39.908556,
    count: 21
  },
  {
    lng: 116.74553,
    lat: 39.875916,
    count: 22
  },
  {
    lng: 116.352289,
    lat: 39.916475,
    count: 23
  },
  {
    lng: 116.441548,
    lat: 39.878262,
    count: 24
  },
  {
    lng: 116.318947,
    lat: 39.942735,
    count: 25
  },
  {
    lng: 116.382585,
    lat: 39.941949,
    count: 26
  },
  {
    lng: 116.42042,
    lat: 39.884017,
    count: 27
  },
  {
    lng: 116.31744,
    lat: 39.892561,
    count: 28
  },
  {
    lng: 116.407059,
    lat: 39.912438,
    count: 29
  },
  {
    lng: 116.412351,
    lat: 39.888082,
    count: 30
  },
  {
    lng: 116.444341,
    lat: 39.915891,
    count: 31
  },
  {
    lng: 116.335385,
    lat: 39.741756,
    count: 32
  },
  {
    lng: 116.3926,
    lat: 40.008733,
    count: 33
  },
  {
    lng: 116.389731,
    lat: 39.92292,
    count: 34
  },

  {
    lng: 116.355675,
    lat: 39.870089,
    count: 41
  },
  {
    lng: 116.295267,
    lat: 39.987171,
    count: 42
  },
  {
    lng: 116.323634,
    lat: 39.911692,
    count: 43
  },
  {
    lng: 116.692769,
    lat: 40.173307,
    count: 44
  },
  {
    lng: 116.287888,
    lat: 39.928531,
    count: 45
  },
  {
    lng: 116.386502,
    lat: 39.922747,
    count: 46
  },
  {
    lng: 116.236773,
    lat: 40.218341,
    count: 47
  },
  {
    lng: 116.490636,
    lat: 39.804253,
    count: 48
  },
  {
    lng: 116.391095,
    lat: 39.925791,
    count: 49
  },
  {
    lng: 116.472402,
    lat: 39.769178,
    count: 50
  },
  {
    lng: 116.38657,
    lat: 39.956731,
    count: 51
  },
  {
    lng: 116.427536,
    lat: 39.943671,
    count: 52
  },
  {
    lng: 116.374547,
    lat: 39.967588,
    count: 53
  },
  {
    lng: 116.380383,
    lat: 39.871634,
    count: 54
  },
  {
    lng: 116.376092,
    lat: 39.965485,
    count: 55
  },
  {
    lng: 116.352424,
    lat: 39.91811,
    count: 56
  },
  {
    lng: 116.020157,
    lat: 40.348526,
    count: 57
  },
  {
    lng: 116.416201,
    lat: 39.951736,
    count: 58
  },
  {
    lng: 116.405392,
    lat: 39.908738,
    count: 59
  },
  {
    lng: 116.49238,
    lat: 39.926248,
    count: 60
  },
  {
    lng: 116.389282,
    lat: 39.988391,
    count: 61
  },
  {
    lng: 116.396683,
    lat: 39.923487,
    count: 62
  },
  {
    lng: 116.41718,
    lat: 39.905213,
    count: 63
  },
  {
    lng: 116.321512,
    lat: 39.913192,
    count: 64
  },
  {
    lng: 116.260028,
    lat: 40.03353,
    count: 65
  },
  {
    lng: 116.394846,
    lat: 39.911168,
    count: 66
  },
  {
    lng: 116.374767,
    lat: 39.96608,
    count: 67
  },
  {
    lng: 116.6841,
    lat: 39.909762,
    count: 68
  },
  {
    lng: 116.3838,
    lat: 39.95811,
    count: 69
  },
  {
    lng: 116.39243,
    lat: 40.01143,
    count: 70
  },
  {
    lng: 116.661912,
    lat: 40.121137,
    count: 71
  },
  {
    lng: 116.333056,
    lat: 39.90123,
    count: 72
  },
  {
    lng: 116.484839,
    lat: 39.881729,
    count: 73
  },
  {
    lng: 116.360923,
    lat: 39.935745,
    count: 74
  },
  {
    lng: 116.408531,
    lat: 39.953194,
    count: 75
  },
  {
    lng: 116.417916,
    lat: 39.954029,
    count: 76
  },
  {
    lng: 116.412215,
    lat: 39.992282,
    count: 77
  },
  {
    lng: 116.181532,
    lat: 40.048762,
    count: 78
  },
  {
    lng: 116.434848,
    lat: 40.070463,
    count: 79
  },
  {
    lng: 116.385039,
    lat: 39.956937,
    count: 80
  },
  {
    lng: 116.755067,
    lat: 39.854499,
    count: 81
  },
  {
    lng: 116.396061,
    lat: 39.912841,
    count: 82
  },
  {
    lng: 116.474303,
    lat: 39.971398,
    count: 83
  },
  {
    lng: 116.376262,
    lat: 39.85811,
    count: 84
  },
  {
    lng: 116.403783,
    lat: 39.954469,
    count: 85
  },
  {
    lng: 116.339136,
    lat: 39.729159,
    count: 86
  },
  {
    lng: 116.240159,
    lat: 39.947003,
    count: 87
  },
  {
    lng: 117.107541,
    lat: 40.141457,
    count: 88
  },
  {
    lng: 116.341813,
    lat: 40.078786,
    count: 89
  },
  {
    lng: 116.320648,
    lat: 39.706455,
    count: 90
  },
  {
    lng: 116.402566,
    lat: 39.960873,
    count: 91
  },
  {
    lng: 116.849261,
    lat: 40.402999,
    count: 92
  },
  {
    lng: 116.521064,
    lat: 39.834187,
    count: 93
  },
  {
    lng: 116.329942,
    lat: 39.925327,
    count: 94
  },
  {
    lng: 116.479852,
    lat: 39.974856,
    count: 95
  },
  {
    lng: 116.399185,
    lat: 39.925736,
    count: 96
  },
  {
    lng: 116.193166,
    lat: 39.911953,
    count: 1
  },
  {
    lng: 116.400916,
    lat: 39.870614,
    count: 2
  },
  {
    lng: 116.518041,
    lat: 39.956615,
    count: 3
  },
  {
    lng: 116.388981,
    lat: 39.997716,
    count: 4
  },
  {
    lng: 116.285852,
    lat: 39.863497,
    count: 5
  },
  {
    lng: 116.294167,
    lat: 39.884599,
    count: 6
  },
  {
    lng: 116.394235,
    lat: 39.996845,
    count: 7
  },
  {
    lng: 116.32471,
    lat: 39.970486,
    count: 8
  },
  {
    lng: 116.496828,
    lat: 39.99335,
    count: 9
  },
  {
    lng: 116.482534,
    lat: 39.934086,
    count: 10
  },
  {
    lng: 116.454662,
    lat: 39.974981,
    count: 11
  },
  {
    lng: 116.387076,
    lat: 39.87631,
    count: 12
  },
  {
    lng: 116.433341,
    lat: 39.92803,
    count: 13
  },
  {
    lng: 116.382196,
    lat: 39.941606,
    count: 14
  },
  {
    lng: 116.244286,
    lat: 39.82905,
    count: 15
  },
  {
    lng: 116.566672,
    lat: 40.176097,
    count: 16
  },
  {
    lng: 116.686862,
    lat: 39.908507,
    count: 17
  },
  {
    lng: 117.240166,
    lat: 40.175796,
    count: 18
  },
  {
    lng: 116.428661,
    lat: 39.866958,
    count: 19
  },
  {
    lng: 116.443292,
    lat: 39.917447,
    count: 20
  },
  {
    lng: 116.356538,
    lat: 39.926711,
    count: 21
  },
  {
    lng: 116.194086,
    lat: 39.912242,
    count: 22
  },
  {
    lng: 116.379861,
    lat: 39.971831,
    count: 23
  },
  {
    lng: 116.377966,
    lat: 39.874647,
    count: 24
  },
  {
    lng: 116.466778,
    lat: 39.926304,
    count: 25
  },
  {
    lng: 116.692078,
    lat: 40.170197,
    count: 26
  },
  {
    lng: 116.428651,
    lat: 39.94275,
    count: 27
  },
  {
    lng: 116.322655,
    lat: 39.939517,
    count: 28
  },
  {
    lng: 116.445601,
    lat: 39.98439,
    count: 29
  },
  {
    lng: 116.662833,
    lat: 39.912238,
    count: 30
  },
  {
    lng: 116.394183,
    lat: 39.925557,
    count: 31
  },
  {
    lng: 116.312788,
    lat: 39.860017,
    count: 32
  },
  {
    lng: 116.104708,
    lat: 40.065563,
    count: 33
  },
  {
    lng: 116.204443,
    lat: 39.938295,
    count: 34
  },
  {
    lng: 116.310917,
    lat: 39.89381,
    count: 35
  },
  {
    lng: 116.265851,
    lat: 39.834247,
    count: 36
  },
  {
    lng: 116.33501,
    lat: 39.742507,
    count: 37
  },
  {
    lng: 116.397519,
    lat: 39.99794,
    count: 38
  },
  {
    lng: 116.441252,
    lat: 39.915566,
    count: 39
  },
  {
    lng: 116.441898,
    lat: 39.856454,
    count: 40
  },
  {
    lng: 116.446552,
    lat: 39.946418,
    count: 41
  },
  {
    lng: 116.359761,
    lat: 39.895327,
    count: 42
  },
  {
    lng: 116.349168,
    lat: 39.893551,
    count: 43
  },
  {
    lng: 116.476819,
    lat: 39.94388,
    count: 44
  },
  {
    lng: 116.29912,
    lat: 39.988433,
    count: 45
  },
  {
    lng: 116.467912,
    lat: 39.770524,
    count: 46
  },
  {
    lng: 116.382134,
    lat: 39.862204,
    count: 47
  },
  {
    lng: 116.483378,
    lat: 39.93431,
    count: 48
  },
  {
    lng: 116.35395,
    lat: 39.910738,
    count: 49
  },
  {
    lng: 116.398771,
    lat: 39.976433,
    count: 50
  },
  {
    lng: 116.462189,
    lat: 39.925864,
    count: 51
  },
  {
    lng: 116.378957,
    lat: 39.806676,
    count: 52
  },
  {
    lng: 116.334199,
    lat: 39.900985,
    count: 53
  },
  {
    lng: 116.443961,
    lat: 39.913511,
    count: 54
  },
  {
    lng: 116.388829,
    lat: 39.95053,
    count: 55
  },
  {
    lng: 116.319655,
    lat: 39.892339,
    count: 56
  },
  {
    lng: 117.431959,
    lat: 40.630521,
    count: 57
  },
  {
    lng: 117.108914,
    lat: 40.140406,
    count: 58
  },
  {
    lng: 116.43019,
    lat: 39.880486,
    count: 59
  },
  {
    lng: 116.250698,
    lat: 39.907186,
    count: 60
  },
  {
    lng: 116.341065,
    lat: 39.766082,
    count: 61
  },
  {
    lng: 116.290335,
    lat: 39.812431,
    count: 62
  },
  {
    lng: 116.360813,
    lat: 39.936362,
    count: 63
  },
  {
    lng: 116.400282,
    lat: 39.995027,
    count: 64
  },
  {
    lng: 116.317257,
    lat: 39.889092,
    count: 65
  },
  {
    lng: 116.482537,
    lat: 39.954978,
    count: 66
  },
  {
    lng: 116.38496,
    lat: 39.954428,
    count: 67
  },
  {
    lng: 116.391803,
    lat: 39.911587,
    count: 68
  },
  {
    lng: 116.4266,
    lat: 39.867228,
    count: 69
  },
  {
    lng: 116.145997,
    lat: 39.790856,
    count: 70
  },
  {
    lng: 116.430265,
    lat: 39.867451,
    count: 71
  },
  {
    lng: 116.315479,
    lat: 39.940668,
    count: 72
  },
  {
    lng: 116.359393,
    lat: 39.975431,
    count: 73
  },
  {
    lng: 116.382347,
    lat: 39.968935,
    count: 74
  },
  {
    lng: 115.987169,
    lat: 40.454625,
    count: 75
  },
  {
    lng: 116.489292,
    lat: 39.931242,
    count: 76
  },
  {
    lng: 116.368238,
    lat: 39.879807,
    count: 77
  },
  {
    lng: 116.493761,
    lat: 39.923885,
    count: 78
  },
  {
    lng: 116.53666,
    lat: 39.8778,
    count: 79
  },
  {
    lng: 116.501743,
    lat: 39.79602,
    count: 80
  },
  {
    lng: 116.582818,
    lat: 39.932646,
    count: 81
  },
  {
    lng: 116.417364,
    lat: 39.869292,
    count: 82
  },
  {
    lng: 116.354305,
    lat: 39.872022,
    count: 83
  },
  {
    lng: 116.375162,
    lat: 40.01344,
    count: 84
  },
  {
    lng: 116.400523,
    lat: 39.881031,
    count: 85
  },
  {
    lng: 116.315365,
    lat: 39.945005,
    count: 86
  },
  {
    lng: 116.44088,
    lat: 39.810753,
    count: 87
  },
  {
    lng: 116.679285,
    lat: 39.916527,
    count: 88
  },
  {
    lng: 116.483694,
    lat: 39.946929,
    count: 89
  },
  {
    lng: 116.341678,
    lat: 40.080021,
    count: 90
  },
  {
    lng: 116.017167,
    lat: 39.889175,
    count: 91
  },
  {
    lng: 116.454692,
    lat: 39.954167,
    count: 92
  },
  {
    lng: 116.410129,
    lat: 40.050952,
    count: 93
  },
  {
    lng: 116.418556,
    lat: 39.872365,
    count: 94
  },
  {
    lng: 116.25432,
    lat: 40.142367,
    count: 95
  },
  {
    lng: 116.658763,
    lat: 39.891072,
    count: 96
  },
  {
    lng: 116.305312,
    lat: 39.9953,
    count: 97
  },
  {
    lng: 116.388761,
    lat: 39.951259,
    count: 98
  },
  {
    lng: 116.68017,
    lat: 39.873413,
    count: 99
  },
  {
    lng: 116.090539,
    lat: 39.796301,
    count: 1
  },
  {
    lng: 116.380305,
    lat: 39.78354,
    count: 2
  },
  {
    lng: 116.348831,
    lat: 40.022543,
    count: 3
  },
  {
    lng: 116.438133,
    lat: 39.960988,
    count: 4
  },
  {
    lng: 116.199587,
    lat: 39.911,
    count: 5
  },
  {
    lng: 116.081743,
    lat: 39.788321,
    count: 6
  },
  {
    lng: 117.24044,
    lat: 40.1752,
    count: 7
  },
  {
    lng: 116.636141,
    lat: 40.327724,
    count: 8
  },
  {
    lng: 116.453166,
    lat: 39.973511,
    count: 9
  },
  {
    lng: 116.583381,
    lat: 39.953315,
    count: 10
  },
  {
    lng: 116.236326,
    lat: 39.90595,
    count: 11
  },
  {
    lng: 116.328305,
    lat: 39.781647,
    count: 12
  },
  {
    lng: 116.260012,
    lat: 39.984951,
    count: 13
  },
  {
    lng: 116.254938,
    lat: 39.916206,
    count: 14
  },
  {
    lng: 116.85469,
    lat: 40.474419,
    count: 15
  },
  {
    lng: 116.309389,
    lat: 39.971918,
    count: 16
  },
  {
    lng: 116.310732,
    lat: 39.971517,
    count: 17
  },
  {
    lng: 116.401885,
    lat: 39.847641,
    count: 18
  },
  {
    lng: 116.427771,
    lat: 39.880572,
    count: 19
  },
  {
    lng: 116.430537,
    lat: 39.880968,
    count: 20
  },
  {
    lng: 116.550673,
    lat: 39.895212,
    count: 21
  },
  {
    lng: 116.345906,
    lat: 39.815152,
    count: 22
  },
  {
    lng: 116.512016,
    lat: 39.868573,
    count: 23
  },
  {
    lng: 115.894604,
    lat: 39.803644,
    count: 24
  },
  {
    lng: 116.32497,
    lat: 40.083198,
    count: 25
  },
  {
    lng: 116.315523,
    lat: 39.858242,
    count: 26
  },
  {
    lng: 116.465052,
    lat: 39.903055,
    count: 27
  },
  {
    lng: 116.464814,
    lat: 39.924176,
    count: 28
  },
  {
    lng: 115.959538,
    lat: 39.727218,
    count: 29
  },
  {
    lng: 116.478895,
    lat: 39.954472,
    count: 30
  },
  {
    lng: 116.337546,
    lat: 39.741337,
    count: 31
  },
  {
    lng: 116.504757,
    lat: 39.83778,
    count: 32
  },
  {
    lng: 116.393143,
    lat: 40.02725,
    count: 33
  },
  {
    lng: 116.23419,
    lat: 40.217361,
    count: 34
  },
  {
    lng: 116.368688,
    lat: 39.829561,
    count: 35
  },
  {
    lng: 116.460134,
    lat: 39.983721,
    count: 36
  },
  {
    lng: 116.381539,
    lat: 39.746766,
    count: 37
  },
  {
    lng: 116.291759,
    lat: 39.983886,
    count: 38
  },
  {
    lng: 116.377613,
    lat: 39.817895,
    count: 39
  },
  {
    lng: 116.306646,
    lat: 39.956296,
    count: 40
  },
  {
    lng: 116.160747,
    lat: 39.818863,
    count: 41
  },
  {
    lng: 116.392912,
    lat: 40.001989,
    count: 42
  },
  {
    lng: 116.199115,
    lat: 39.91276,
    count: 43
  },
  {
    lng: 116.434577,
    lat: 39.812232,
    count: 44
  },
  {
    lng: 116.495843,
    lat: 39.925538,
    count: 45
  },
  {
    lng: 116.333803,
    lat: 39.913224,
    count: 46
  },
  {
    lng: 116.489277,
    lat: 39.941842,
    count: 47
  },
  {
    lng: 116.510514,
    lat: 39.973547,
    count: 48
  },
  {
    lng: 116.474685,
    lat: 39.936648,
    count: 49
  },
  {
    lng: 116.418054,
    lat: 39.905091,
    count: 50
  },
  {
    lng: 116.285529,
    lat: 39.926274,
    count: 51
  },
  {
    lng: 116.289399,
    lat: 39.948054,
    count: 52
  },
  {
    lng: 116.508241,
    lat: 39.920234,
    count: 53
  },
  {
    lng: 116.317979,
    lat: 40.000721,
    count: 54
  },
  {
    lng: 116.428324,
    lat: 39.868263,
    count: 55
  },
  {
    lng: 116.407517,
    lat: 40.016715,
    count: 56
  },
  {
    lng: 116.338841,
    lat: 39.969646,
    count: 57
  },
  {
    lng: 116.495703,
    lat: 39.992607,
    count: 58
  },
  {
    lng: 116.369659,
    lat: 39.97595,
    count: 59
  },
  {
    lng: 116.291709,
    lat: 39.96228,
    count: 60
  },
  {
    lng: 116.311003,
    lat: 39.998264,
    count: 61
  },
  {
    lng: 116.391429,
    lat: 39.93324,
    count: 62
  },
  {
    lng: 116.406033,
    lat: 39.95407,
    count: 63
  },
  {
    lng: 116.391856,
    lat: 39.912004,
    count: 64
  },
  {
    lng: 116.356434,
    lat: 39.871474,
    count: 65
  },
  {
    lng: 116.477081,
    lat: 39.970334,
    count: 66
  },
  {
    lng: 116.475337,
    lat: 39.939749,
    count: 67
  },
  {
    lng: 116.752911,
    lat: 39.916369,
    count: 68
  },
  {
    lng: 116.470361,
    lat: 39.874606,
    count: 69
  },
  {
    lng: 116.489172,
    lat: 39.949033,
    count: 70
  },
  {
    lng: 116.502514,
    lat: 39.973734,
    count: 71
  },
  {
    lng: 116.186985,
    lat: 39.920185,
    count: 72
  },
  {
    lng: 116.583743,
    lat: 39.95335,
    count: 73
  },
  {
    lng: 116.119183,
    lat: 39.732055,
    count: 74
  },
  {
    lng: 116.391902,
    lat: 39.93331,
    count: 75
  },
  {
    lng: 116.488588,
    lat: 39.953371,
    count: 76
  },
  {
    lng: 116.381798,
    lat: 39.975717,
    count: 77
  },
  {
    lng: 116.384689,
    lat: 39.827773,
    count: 78
  },
  {
    lng: 116.445287,
    lat: 39.894354,
    count: 79
  },
  {
    lng: 116.24048,
    lat: 39.947687,
    count: 80
  },
  {
    lng: 116.413605,
    lat: 40.04902,
    count: 81
  },
  {
    lng: 116.239012,
    lat: 39.904288,
    count: 82
  },
  {
    lng: 116.408522,
    lat: 40.016971,
    count: 83
  },
  {
    lng: 116.475833,
    lat: 39.947107,
    count: 84
  },
  {
    lng: 116.43476,
    lat: 39.901671,
    count: 85
  },
  {
    lng: 116.40229,
    lat: 39.869205,
    count: 86
  },
  {
    lng: 116.226013,
    lat: 40.213485,
    count: 87
  },
  {
    lng: 116.689042,
    lat: 39.889192,
    count: 88
  },
  {
    lng: 116.377252,
    lat: 39.873622,
    count: 89
  },
  {
    lng: 116.53061,
    lat: 40.103146,
    count: 90
  },
  {
    lng: 116.416271,
    lat: 39.905187,
    count: 91
  },
  {
    lng: 116.531169,
    lat: 39.91276,
    count: 92
  },
  {
    lng: 116.17849,
    lat: 40.075692,
    count: 93
  },
  {
    lng: 116.188616,
    lat: 40.102413,
    count: 94
  },
  {
    lng: 116.531799,
    lat: 39.84939,
    count: 95
  },
  {
    lng: 116.443707,
    lat: 39.87558,
    count: 96
  },
  {
    lng: 116.814298,
    lat: 40.53416,
    count: 97
  },
  {
    lng: 116.428247,
    lat: 39.873118,
    count: 98
  },
  {
    lng: 116.290774,
    lat: 39.963116,
    count: 99
  },
  {
    lng: 116.299918,
    lat: 39.936094,
    count: 100
  },
  {
    lng: 116.489325,
    lat: 39.944556,
    count: 101
  },
  {
    lng: 116.339297,
    lat: 40.038739,
    count: 102
  },
  {
    lng: 116.485631,
    lat: 39.804667,
    count: 103
  },
  {
    lng: 116.480549,
    lat: 39.955012,
    count: 104
  },
  {
    lng: 116.381977,
    lat: 39.878496,
    count: 1
  },
  {
    lng: 116.259586,
    lat: 40.043622,
    count: 2
  },
  {
    lng: 116.587813,
    lat: 40.015618,
    count: 3
  },
  {
    lng: 116.35472,
    lat: 39.975865,
    count: 4
  },
  {
    lng: 116.644011,
    lat: 40.299776,
    count: 5
  },
  {
    lng: 116.299449,
    lat: 39.95324,
    count: 6
  },
  {
    lng: 116.332228,
    lat: 39.900741,
    count: 7
  },
  {
    lng: 116.377459,
    lat: 39.80869,
    count: 8
  },
  {
    lng: 116.657873,
    lat: 40.120521,
    count: 9
  },
  {
    lng: 116.154466,
    lat: 39.731616,
    count: 10
  },
  {
    lng: 116.845418,
    lat: 40.375612,
    count: 11
  },
  {
    lng: 116.466696,
    lat: 39.766475,
    count: 12
  },
  {
    lng: 116.45685,
    lat: 40.011172,
    count: 13
  },
  {
    lng: 116.406651,
    lat: 39.970182,
    count: 14
  },
  {
    lng: 116.428161,
    lat: 39.866144,
    count: 15
  },
  {
    lng: 116.504801,
    lat: 39.836822,
    count: 16
  },
  {
    lng: 116.439995,
    lat: 39.81546,
    count: 17
  },
  {
    lng: 116.559057,
    lat: 39.936131,
    count: 18
  },
  {
    lng: 116.225584,
    lat: 39.842961,
    count: 19
  },
  {
    lng: 116.64103,
    lat: 40.141812,
    count: 20
  },
  {
    lng: 116.306028,
    lat: 39.860581,
    count: 21
  },
  {
    lng: 116.403426,
    lat: 40.066843,
    count: 22
  },
  {
    lng: 116.399935,
    lat: 40.009504,
    count: 23
  },
  {
    lng: 116.309222,
    lat: 39.913107,
    count: 24
  },
  {
    lng: 116.295396,
    lat: 39.784501,
    count: 25
  },
  {
    lng: 116.289673,
    lat: 39.963462,
    count: 26
  },
  {
    lng: 116.445731,
    lat: 40.051509,
    count: 27
  },
  {
    lng: 116.395362,
    lat: 39.975426,
    count: 28
  },
  {
    lng: 116.605608,
    lat: 40.0489,
    count: 29
  },
  {
    lng: 116.421157,
    lat: 39.975636,
    count: 30
  },
  {
    lng: 116.452161,
    lat: 39.977081,
    count: 31
  },
  {
    lng: 116.242604,
    lat: 40.22134,
    count: 32
  },
  {
    lng: 116.32532,
    lat: 39.970535,
    count: 33
  },
  {
    lng: 116.685587,
    lat: 39.926874,
    count: 34
  },
  {
    lng: 116.39186,
    lat: 39.912056,
    count: 35
  },
  {
    lng: 116.326004,
    lat: 39.974148,
    count: 36
  },
  {
    lng: 116.677542,
    lat: 39.892667,
    count: 37
  },
  {
    lng: 116.835958,
    lat: 40.375008,
    count: 38
  },
  {
    lng: 116.484969,
    lat: 39.956518,
    count: 39
  },
  {
    lng: 115.95685,
    lat: 39.732297,
    count: 40
  },
  {
    lng: 116.380024,
    lat: 39.872133,
    count: 41
  },
  {
    lng: 116.396477,
    lat: 39.928246,
    count: 42
  },
  {
    lng: 116.390986,
    lat: 39.92675,
    count: 43
  },
  {
    lng: 116.346845,
    lat: 40.018932,
    count: 44
  },
  {
    lng: 116.381966,
    lat: 39.970729,
    count: 45
  },
  {
    lng: 116.337349,
    lat: 39.752131,
    count: 46
  },
  {
    lng: 116.494995,
    lat: 39.99648,
    count: 47
  },
  {
    lng: 116.314029,
    lat: 39.516896,
    count: 48
  },
  {
    lng: 116.662237,
    lat: 40.122764,
    count: 49
  },
  {
    lng: 116.841367,
    lat: 40.379938,
    count: 50
  },
  {
    lng: 116.365928,
    lat: 39.975824,
    count: 51
  },
  {
    lng: 116.489236,
    lat: 39.939992,
    count: 52
  },
  {
    lng: 116.363994,
    lat: 39.852943,
    count: 53
  },
  {
    lng: 116.34283,
    lat: 39.754081,
    count: 54
  },
  {
    lng: 116.361183,
    lat: 39.894634,
    count: 55
  },
  {
    lng: 116.412822,
    lat: 39.9769,
    count: 56
  },
  {
    lng: 116.40433,
    lat: 39.97541,
    count: 57
  },
  {
    lng: 116.413478,
    lat: 39.948868,
    count: 58
  },
  {
    lng: 116.406129,
    lat: 39.932386,
    count: 59
  },
  {
    lng: 116.451852,
    lat: 39.995137,
    count: 60
  },
  {
    lng: 116.349718,
    lat: 39.870509,
    count: 61
  },
  {
    lng: 116.568628,
    lat: 39.926382,
    count: 62
  },
  {
    lng: 116.643881,
    lat: 40.300758,
    count: 63
  },
  {
    lng: 116.440445,
    lat: 39.881325,
    count: 64
  },
  {
    lng: 116.48299,
    lat: 39.869588,
    count: 65
  },
  {
    lng: 116.323732,
    lat: 40.082528,
    count: 66
  },
  {
    lng: 116.257834,
    lat: 39.876782,
    count: 67
  },
  {
    lng: 116.3596,
    lat: 40.034545,
    count: 68
  },
  {
    lng: 116.349841,
    lat: 39.875597,
    count: 69
  },
  {
    lng: 116.403928,
    lat: 39.879252,
    count: 70
  },
  {
    lng: 116.42005,
    lat: 39.833467,
    count: 71
  },
  {
    lng: 116.663001,
    lat: 39.91046,
    count: 72
  },
  {
    lng: 116.406568,
    lat: 39.908939,
    count: 73
  },
  {
    lng: 116.405188,
    lat: 39.909159,
    count: 74
  },
  {
    lng: 116.415107,
    lat: 39.872521,
    count: 75
  },
  {
    lng: 116.321197,
    lat: 39.767552,
    count: 76
  },
  {
    lng: 116.211721,
    lat: 39.688611,
    count: 77
  },
  {
    lng: 116.451346,
    lat: 39.882833,
    count: 78
  },
  {
    lng: 116.557492,
    lat: 39.875288,
    count: 79
  },
  {
    lng: 116.420546,
    lat: 39.899053,
    count: 80
  },
  {
    lng: 116.440968,
    lat: 39.898035,
    count: 81
  },
  {
    lng: 116.096699,
    lat: 39.94052,
    count: 82
  },
  {
    lng: 116.410422,
    lat: 39.996992,
    count: 83
  },
  {
    lng: 116.376382,
    lat: 40.040343,
    count: 84
  },
  {
    lng: 116.664304,
    lat: 39.912656,
    count: 85
  },
  {
    lng: 116.477188,
    lat: 39.972973,
    count: 86
  },
  {
    lng: 116.400057,
    lat: 39.883241,
    count: 87
  },
  {
    lng: 116.287055,
    lat: 39.865057,
    count: 88
  },
  {
    lng: 116.47842,
    lat: 39.975087,
    count: 89
  },
  {
    lng: 116.481061,
    lat: 39.973994,
    count: 90
  },
  {
    lng: 116.428439,
    lat: 39.943564,
    count: 91
  },
  {
    lng: 116.507173,
    lat: 39.815616,
    count: 92
  },
  {
    lng: 116.405081,
    lat: 39.959449,
    count: 93
  },
  {
    lng: 116.40121,
    lat: 39.869219,
    count: 94
  },
  {
    lng: 116.437595,
    lat: 39.878214,
    count: 95
  },
  {
    lng: 116.448647,
    lat: 39.981149,
    count: 96
  },
  {
    lng: 116.239298,
    lat: 40.218372,
    count: 97
  },
  {
    lng: 116.402223,
    lat: 39.960511,
    count: 98
  },
  {
    lng: 116.664158,
    lat: 40.120092,
    count: 99
  },
  {
    lng: 116.119102,
    lat: 40.233172,
    count: 99
  },
  {
    lng: 116.666931,
    lat: 39.917685,
    count: 100
  },
  {
    lng: 115.977448,
    lat: 40.456067,
    count: 101
  },
  {
    lng: 116.355541,
    lat: 39.911069,
    count: 1
  },
  {
    lng: 116.474525,
    lat: 39.944593,
    count: 2
  },
  {
    lng: 116.35277,
    lat: 39.910566,
    count: 3
  },
  {
    lng: 116.310743,
    lat: 39.915123,
    count: 4
  },
  {
    lng: 116.384415,
    lat: 39.948468,
    count: 5
  },
  {
    lng: 116.470283,
    lat: 39.92274,
    count: 6
  },
  {
    lng: 116.545304,
    lat: 39.632635,
    count: 7
  },
  {
    lng: 116.358194,
    lat: 39.898647,
    count: 8
  },
  {
    lng: 116.311002,
    lat: 39.917643,
    count: 9
  },
  {
    lng: 116.387084,
    lat: 39.959407,
    count: 10
  },
  {
    lng: 116.399161,
    lat: 39.972319,
    count: 11
  },
  {
    lng: 116.41415,
    lat: 40.048341,
    count: 12
  },
  {
    lng: 116.283811,
    lat: 39.862684,
    count: 13
  },
  {
    lng: 116.154671,
    lat: 39.793723,
    count: 14
  },
  {
    lng: 116.338059,
    lat: 40.034402,
    count: 15
  },
  {
    lng: 116.564921,
    lat: 40.336754,
    count: 16
  },
  {
    lng: 116.396465,
    lat: 39.928236,
    count: 17
  },
  {
    lng: 116.345465,
    lat: 39.815134,
    count: 18
  },
  {
    lng: 117.105997,
    lat: 40.140457,
    count: 19
  },
  {
    lng: 116.458762,
    lat: 40.011334,
    count: 20
  },
  {
    lng: 116.330312,
    lat: 39.892811,
    count: 21
  },
  {
    lng: 116.246434,
    lat: 39.981835,
    count: 22
  },
  {
    lng: 116.482718,
    lat: 39.967001,
    count: 23
  },
  {
    lng: 116.531887,
    lat: 39.91018,
    count: 24
  },
  {
    lng: 116.303479,
    lat: 40.030135,
    count: 25
  },
  {
    lng: 116.567226,
    lat: 39.897282,
    count: 26
  },
  {
    lng: 116.443197,
    lat: 39.810833,
    count: 27
  },
  {
    lng: 116.271062,
    lat: 40.205664,
    count: 28
  },
  {
    lng: 116.430094,
    lat: 39.975569,
    count: 29
  },
  {
    lng: 116.320701,
    lat: 40.030695,
    count: 30
  },
  {
    lng: 116.318237,
    lat: 39.945583,
    count: 31
  },
  {
    lng: 116.384177,
    lat: 39.976624,
    count: 32
  },
  {
    lng: 116.609751,
    lat: 39.67949,
    count: 33
  },
  {
    lng: 116.470793,
    lat: 39.976487,
    count: 34
  },
  {
    lng: 116.451952,
    lat: 39.994476,
    count: 35
  },
  {
    lng: 116.898355,
    lat: 40.465999,
    count: 36
  },
  {
    lng: 116.324261,
    lat: 39.97006,
    count: 37
  },
  {
    lng: 116.345849,
    lat: 39.902789,
    count: 38
  },
  {
    lng: 116.392448,
    lat: 39.949775,
    count: 39
  },
  {
    lng: 116.404969,
    lat: 39.869671,
    count: 40
  },
  {
    lng: 116.391978,
    lat: 39.951331,
    count: 41
  },
  {
    lng: 116.293389,
    lat: 39.963228,
    count: 42
  },
  {
    lng: 116.354359,
    lat: 39.871352,
    count: 43
  },
  {
    lng: 116.250473,
    lat: 39.905799,
    count: 44
  },
  {
    lng: 116.529661,
    lat: 39.912838,
    count: 45
  },
  {
    lng: 116.400244,
    lat: 39.953832,
    count: 46
  },
  {
    lng: 116.33445,
    lat: 39.790326,
    count: 47
  },
  {
    lng: 116.327622,
    lat: 39.795556,
    count: 48
  },
  {
    lng: 116.394292,
    lat: 39.948671,
    count: 49
  }
]
const showBtn = ref(true)
var map = shallowRef(null)
var heatmap = ''
var dialogVisible2 = ref(false)
const initMap = () => {
  AMapLoader.load({
    // key: "2b22402984a62e37a7cf1854ceec05f1", // 申请好的Web端开发者Key，首次调用 load 时必填
    key: '44d8006d51e66d16119fdc06601c4b29',
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.HeatMap', 'AMap.Icon'] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      map = new AMap.Map('container', {
        //设置地图容器id
        viewMode: '3D', //是否为3D地图模式
        zoom: 13.3, //初始化地图级别
        center: [116.403512, 39.934204], //初始化地图中心点位置
        // mapStyle: 'amap://styles/whitesmoke',
        // mapStyle: "amap://styles/e50de4d7443ce2cc633112de2de760df",
        mapStyle: 'amap://styles/3fc583b7d06ea880b93c9c3cede8c190'
      })
      //异步加载插件
      var circle = new AMap.Circle({
        center: [116.427528, 39.905042],
        radius: 300, //半径
        borderWeight: 3,
        strokeColor: '#FF33FF',
        strokeOpacity: 1,
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        strokeStyle: 'dashed',
        strokeDasharray: [10, 10],
        // 线样式还支持 'dashed'
        fillColor: '#ee2200',
        zIndex: 50
      })
      circle.on('click', showDialog)
      map.add(circle)
      map.setFitView([circle])
      map.plugin('AMap.HeatMap', function () {
        //异步加载插件
        heatmap = new AMap.HeatMap(map, {
          radius: 80, //给定半径
          opacity: [0, 0.8],
          gradient: {
            0.5: '#19caad',
            0.65: '#8cc7b5',
            0.7: '#bee7e9',
            // 0.9: '#3baeca',
            1.0: '#3baeca'
            // 1.0: '#f4606c',
          }
        })
        heatmap.setDataSet({
          data: heatmapData,
          max: 100
        })
      })

      let list = [
        // 共享单车仿造数据
        [116.429028, 39.905042],
        [116.429328, 39.905144],
        [116.429428, 39.905344],
        [116.429428, 39.905544],
        [116.429428, 39.905744],
        [116.429528, 39.905844],
        [116.429628, 39.905544],
        [116.429528, 39.905444]
      ]
      map.plugin('AMap.Icon', function () {
        var startIcon = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(32, 32),
          // 图标的取图地址
          image: bicycle,
          anchor: 'center',
          // 图标所用图片大小
          imageSize: new AMap.Size(32, 32)
          // 图标取图偏移量
        })
        var icon1 = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(32, 32),
          // 图标的取图地址
          image: iconimg1,
          anchor: 'center',
          // 图标所用图片大小
          imageSize: new AMap.Size(32, 32)
          // 图标取图偏移量
        })
        var icon2 = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(32, 32),
          // 图标的取图地址
          image: iconimg2,
          anchor: 'center',
          // 图标所用图片大小
          imageSize: new AMap.Size(32, 32)
          // 图标取图偏移量
        })
        var icon3 = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(32, 32),
          // 图标的取图地址
          image: iconimg3,
          anchor: 'center',
          // 图标所用图片大小
          imageSize: new AMap.Size(32, 32)
          // 图标取图偏移量
        })

        list.forEach((item) => {
          var endMarker = new AMap.Marker({
            position: new AMap.LngLat(item[0], item[1]),
            icon: startIcon
          })
          map.add([endMarker])
        })
        var icon1dMarker = new AMap.Marker({
          position: new AMap.LngLat(116.424481, 39.905319),
          icon: icon1
        })
        var icon2dMarker = new AMap.Marker({
          position: new AMap.LngLat(116.429481, 39.904319),
          icon: icon2
        })

        map.add([icon2dMarker])

        //异步加载插件
      })
    })
    .catch((e) => {
      console.log(e)
    })
}
const showDialog = () => {
  dialogVisible2.value = true
}
const showMap = () => {
  heatmap.show()
  showBtn.value = true
}
const hideMap = () => {
  heatmap.hide()
  showBtn.value = false
}
onMounted(() => {
  initMap()
})
const count = ref(0)
</script>

<style scoped>
#container {
  width: 1920px;
  height: 1080px;
  position: relative;
}
.pos-container {
  position: fixed;
  top: 90px;
  left: 400px;
  z-index: 1000;
}
</style>
