"""
A File that returns the index of the API
@author Mike Washburn
"""
from django.shortcuts import render


def index(request):
    """
    Return the index if requested
    Args:
        request: The request object

    Returns:
        A render of index.html

    """
    return render(request, 'dist/index.html')
