do ->
  class ActivityModel extends Backbone.Model
    defaults:
      name: null
      description: ''
      location: null
      duration: 0
      categories: []
      lastModified: 0
      shitId: null