Redmine::Plugin.register :custom_fields_addin do
  name 'Custom Fields Addin for custom fields'
  author 'Chechin S. V.'
  description 'This is a addin for Computed custom field'
  version '0.0.1'
  url 'http://getnotary.obt.local/schechin/custom_fields_addin'
  author_url 'http://getnotary.obt.local/u/schechin'
end

ActionDispatch::Callbacks.to_prepare do
  require_dependency 'custom_fields_addin/hooks'
end