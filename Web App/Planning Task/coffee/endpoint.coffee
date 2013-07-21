$('document').ready ( =>
  if $.browser.msie
    alert 'Please return this HIT. Unfortunately, you can\'t do this task because you are using Internet Explorer.'
    return

  session = new com.uid.crowdcierge.Session

  urlParser = new com.uid.crowdcierge.UrlParser
    session: session
  urlParser.readUrlParameters()

  # Stream must be loaded before state
  streamLoader = new com.uid.crowdcierge.StreamLoader
    session: session
  streamLoader.load()

  stateLoader = new com.uid.crowdcierge.StateLoader
    session: session
  stateLoader.load()

  # Controller for Todo items
  todoManager = new com.uid.crowdcierge.TodoManager
    session: session
  todoManager.updateTodo()

  # State and stream controllers
  stateController = new com.uid.crowdcierge.StateController
    session: session
  streamController = new com.uid.crowdcierge.StreamController
    session: session
    stateController: stateController

  view = new com.uid.crowdcierge.MainView
    session: session

  $('body').empty()
  $('body').append view.$el
  view.render()

  console.log session
)