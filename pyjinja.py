import json
import sys
from jinja2 import FileSystemLoader
from jinja2.environment import Environment

env = Environment()
env.loader = FileSystemLoader(sys.argv[2])
template = env.get_template(sys.argv[3] + '.html')

template_data = json.loads(sys.argv[1])

print template.render(template_data).encode('utf-8')
