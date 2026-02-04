using UnityEngine;

public class PullToLaunch : MonoBehaviour
{
    public float launchForceMultiplier = 50f;
    public LineRenderer aimLine;
    
    private Vector2 dragStartPos;
    private bool isDragging = false;
    private Rigidbody rb;

    void Start() { rb = GetComponent<Rigidbody>(); }

    void OnMouseDown()
    {
        dragStartPos = Input.mousePosition;
        isDragging = true;
        if (aimLine != null) aimLine.enabled = true;
    }

    void OnMouseDrag()
    {
        if (!isDragging) return;

        Vector2 currentMousePos = Input.mousePosition;
        Vector2 dragDirection = dragStartPos - currentMousePos;
        
        if (aimLine != null)
        {
            Vector3 lineEnd = transform.position + (transform.forward * dragDirection.magnitude * 0.1f);
            aimLine.SetPosition(0, transform.position);
            aimLine.SetPosition(1, lineEnd);
        }
    }

    void OnMouseUp()
    {
        if (!isDragging) return;
        isDragging = false;
        if (aimLine != null) aimLine.enabled = false;

        Vector2 dragDirection = dragStartPos - (Vector2)Input.mousePosition;
        float force = dragDirection.magnitude * launchForceMultiplier;
        
        rb.AddRelativeForce(Vector3.forward * force);
    }
}
