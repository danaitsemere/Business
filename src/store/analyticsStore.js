import { defineStore } from 'pinia'
import { ref } from 'vue'
import { viewsOverTime, inquiriesOverTime, productPerformance, customerDemographics, jobsOverTime, earningsOverTime } from '../mock/analytics.js'

export const useAnalyticsStore = defineStore('analytics', () => {
  const views = ref([...viewsOverTime])
  const inquiries = ref([...inquiriesOverTime])
  const performance = ref([...productPerformance])
  const demographics = ref([...customerDemographics])
  const jobs = ref([...jobsOverTime])
  const earnings = ref([...earningsOverTime])

  function getViewsData() { return views.value }
  function getInquiriesData() { return inquiries.value }
  function getProductPerformance() { return performance.value }
  function getCustomerDemographics() { return demographics.value }
  function getJobsData() { return jobs.value }
  function getEarningsData() { return earnings.value }

  return {
    views,
    inquiries,
    performance,
    demographics,
    jobs,
    earnings,
    getViewsData,
    getInquiriesData,
    getProductPerformance,
    getCustomerDemographics,
    getJobsData,
    getEarningsData
  }
})
