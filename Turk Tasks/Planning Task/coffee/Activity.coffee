do ->
  class com.uid.crowdcierge.Activity extends Backbone.Model
    defaults:
      name: null
      description: ''
      location: null
      duration: 0
      categories: []
      createTime: 0
      start: 0