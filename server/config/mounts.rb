def mount(server)
  require 'theme_servlet'
  require 'static_assets_servlet'
  require 'theme_picker_servlet'
  require 'vision_servlet'
  
  # setup all the mounts for the server here
  server.mount('/', ThemeServlet)

  server.mount('/stylesheets/vision/', VisionServlet)
  server.mount('/javascripts/vision/', VisionServlet)

  server.mount('/files/shops/random_number/assets/', StaticAssetsServlet)

  server.mount('/dashboard/', ThemePickerServlet)
  $webrick = server
end