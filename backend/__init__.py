import pymysql

pymysql.version_info = (10, 6, 0, 'final', 0)  # Spoofs version to 10.6.0
pymysql.install_as_MySQLdb()