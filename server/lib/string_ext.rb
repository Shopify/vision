class String
  
  def to_filename
    self.gsub(/([a-z])([A-Z])/, '\1_\2').downcase.gsub(/(\_controller|\_servlet)$/, '')     
  end
  
  def to_classname
    self.gsub(/\_\w|^\w/) { |match| match[-1..-1].upcase }
  end
  
  def to_handle
    result = self.downcase

    # strip all non word chars
    result.gsub!(/\W/, ' ')

    # replace all white space sections with a dash
    result.gsub!(/\ +/, '-')

    # trim dashes
    result.gsub!(/(-+)$/, '')
    result.gsub!(/^(-+)/, '')  
    result
  end
  
end
