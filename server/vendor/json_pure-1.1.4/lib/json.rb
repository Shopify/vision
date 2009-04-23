require 'json/common'
module JSON
  require 'json/version'

  if VARIANT_BINARY
    require 'json/ext'
  else
    begin
      require 'json/ext'
    rescue LoadError
      require 'json/pure'
    end
  end
end
