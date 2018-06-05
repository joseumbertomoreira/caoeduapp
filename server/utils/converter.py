#-*- unicode

import xlrd
from io import BytesIO
import unicodecsv as csv

def csv_from_excel():
  wb = xlrd.open_workbook('ESCOLAS.xlsx')
  your_csv_file = BytesIO()
  sh = wb.sheet_by_name('Plan1')
  wr = csv.writer(your_csv_file, encoding='utf-8')

  for run in range(sh.nrows):
  	wr.writerow(sh.row_values(run))

  your_csv_file.close()

# runs the csv_from_excel function:
csv_from_excel()