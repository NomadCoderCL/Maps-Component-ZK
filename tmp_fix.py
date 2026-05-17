import os
import re

files = [
    r'd:\Proyectos\ProyectosNegocio\Maps-Component-ZK\zk-map-openlayers\src\main\java\com\zkoss\component\map\openlayers\OLMapComponent.java',
    r'd:\Proyectos\ProyectosNegocio\Maps-Component-ZK\zk-map-leaflet\src\main\java\com\zkoss\component\map\leaflet\LFMapComponent.java',
    r'd:\Proyectos\ProyectosNegocio\Maps-Component-ZK\zk-map-google\src\main\java\com\zkoss\component\map\google\GMMapComponent.java',
    r'd:\Proyectos\ProyectosNegocio\Maps-Component-ZK\src\main\java\com\zkoss\component\map\MapComponent.java'
]

for file_path in files:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'import org.zkoss.zk.au.out.AuInvoke;' not in content:
        content = content.replace('import org.zkoss.zk.au.AuRequest;', 'import org.zkoss.zk.au.AuRequest;\nimport org.zkoss.zk.au.out.AuInvoke;')
        # also handle case where it's not near AuRequest, but just after package
        if 'import org.zkoss.zk.au.out.AuInvoke;' not in content:
           content = re.sub(r'(package .*?;)', r'\1\n\nimport org.zkoss.zk.au.out.AuInvoke;', content, count=1)

    content = re.sub(r'response\s*\(\s*\"([^\"]+)\"\s*,\s*([^\)]+?)\s*\)', r'response(new AuInvoke(this, "\1", \2))', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
print('Done!')
