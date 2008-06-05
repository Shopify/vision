require 'yaml'

module Database
  
  def self.find(what, table)
    case what 
    when Numeric
      db[table.to_s].find { |r| r['id'] == what } 
    when :all
      db[table.to_s]
    when :first
      db[table.to_s].find { |a| r['id'] == 1 } 
    end
  end
  
  def self.db
    db = YAML.load(File.read("#{ROOT}/db/database.yml"))
    
    # We need to add collections to the products    
    db['products'].each do |product|
      collections = db['collections'].find_all do |collection|
        collection['products'].any? { |p| p['id'].to_i == product['id'].to_i }
      end      
      product['collections'] = collections      
    end
        
    db
  end
  
end