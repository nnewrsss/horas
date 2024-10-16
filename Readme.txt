จงฟังและปราบปลิ้ม ถึงเวลามาใช้ Anaconda กันเถอะ

Anaconda คือ env ที่จะอยู่บนเครื่องเราไม่ได้ลงใน folder แบบ python มันจะอยู่ drive C และใช้ง่ายมากๆ เมื่อทุกคนใช้ Anaconda จะไม่ต้องไปลง github 30,000 กว่าไฟล์ทุกครั้ง

โดยขั้นตอนง่ายแค่โหลด  Anaconda
https://www.anaconda.com/download/

เมื่อโหลดเสร็จติดตั้งอย่าลืมติ้กเพิ่ม PATH ทุกครั้งถ้ามี ห้าม nextๆ

เมื่อทุกคนเสร็จก็ restart คอมรอบนึง

และเข้า vscode แบบเดิมและทำการ

conda create --n [ชื่อ environment] เช่น
conda create --n horas

เมื่อสร้างเสร็จเราก็ กระตุ้น environment โดยการ
conda activate [ชื่อ environment]

เมื่อกระตุ้นเสร็จก็ต้องโหลด package  ที่เราต้องใช้กันโดยการ
conda env create -f environment.yaml

เสร็จเรียบร้อยหลังจากนั้นเราก็สามารถใข้ได้ปกติโดยไม่ต้องโหลดไฟล์มาแบบ manual แล้ว