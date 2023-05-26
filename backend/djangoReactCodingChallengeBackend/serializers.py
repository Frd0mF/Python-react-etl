from rest_framework import serializers
from .models import transformation



class transformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = transformation
        fields = ['id', 'saveKey','operations','dataArray']

class tableUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = transformation
        fields = ['dataArray']

class operationsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = transformation
        fields = ['operations']