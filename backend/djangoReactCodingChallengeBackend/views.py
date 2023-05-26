from .serializers import transformationSerializer, tableUpdateSerializer,operationsUpdateSerializer
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json
import pandas as pd

from sqlalchemy import create_engine, ForeignKey, Column, Integer, String, CHAR, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


Base = declarative_base()

#DataBase Schema
class Transformation(Base):
    __tablename__ = 'transformation'
    saveKey = Column(String, primary_key=True)
    operations = Column(JSON)
    dataArray = Column(JSON)

    def __init__(self, saveKey, operations, dataArray):
        self.saveKey = saveKey
        self.operations = operations
        self.dataArray = dataArray

    def __repr__(self):
        return "<transformation(saveKey='%s', operations='%s', dataArray='%s')>" % (self.saveKey, self.operations, self.dataArray)


engine = create_engine('sqlite:///transformations.db', echo=True)
Base.metadata.create_all(bind=engine)

#get table by saveKey
@api_view(['GET'])
def getTableBySaveKey(request, saveKey):
    try:
        Session = sessionmaker(bind=engine)
        session = Session()
        results = session.query(Transformation).filter(Transformation.saveKey == saveKey).first()
        if results:
            return JsonResponse({'saveKey': results.saveKey, 'operations': results.operations, 'dataArray': results.dataArray}, safe=False)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#add table
@api_view(['POST'])
def addTable(request):   
    if request.method == 'POST':
        serializer = transformationSerializer(data=request.data)
        if serializer.is_valid():
            saveKey = request.data.get('saveKey')
            operations = request.data.get('operations')
            dataArray = request.data.get('dataArray')
            Session = sessionmaker(bind=engine)
            session = Session()
            data = Transformation(saveKey, operations, dataArray)
            session.add(data)
            session.commit()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#update table's dataArray    
@api_view(['PATCH'])
def updateTable(request, saveKey):
    if request.method == 'PATCH':
        operation = request.data.get('operation')
        index =  request.data.get('index')
        Session = sessionmaker(bind=engine)
        session = Session()
        tableData = session.query(Transformation).filter(Transformation.saveKey == saveKey).first()
        jsonTableData = json.loads(tableData.dataArray)
        df = pd.DataFrame(jsonTableData)
        for ind in df.index:
            if ind == index:
                df['Amount'][ind] = str(df['Amount'][ind]).replace('$', '')
                df['Amount'][ind] = eval(operation.replace("X", str(df['Amount'][ind])))
        backToDict = df.reset_index(drop=True).to_json(orient='records')
        session.query(Transformation).filter(Transformation.saveKey == saveKey).update({Transformation.dataArray: backToDict})
        session.commit()
        return JsonResponse(backToDict,  safe=False)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#update table's operations
@api_view(['PATCH'])
def updateTableTransformation(request, saveKey):
        if request.method == 'PATCH':
            serializer = operationsUpdateSerializer( data=request.data)
            if serializer.is_valid():
                operations = request.data.get('operations')
                Session = sessionmaker(bind=engine)
                session = Session()
                session.query(Transformation).filter(Transformation.saveKey == saveKey).update({Transformation.operations: operations})
                session.commit()
                return JsonResponse(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#delete table        
@api_view(['DELETE'])
def deleteTable(request, saveKey):
    if request.method == 'DELETE':
        Session = sessionmaker(bind=engine)
        session = Session()
        session.query(Transformation).filter(Transformation.saveKey == saveKey).delete()
        session.commit()
        return Response(status=status.HTTP_204_NO_CONTENT)

    
