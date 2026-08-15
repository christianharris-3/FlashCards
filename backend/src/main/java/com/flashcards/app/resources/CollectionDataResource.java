package com.flashcards.app.resources;

import com.flashcards.app.managers.CollectionManager;
import com.flashcards.app.managers.UserValidationManager;
import com.flashcards.app.models.User;
import com.flashcards.app.models.dao.CollectionInfo;
import com.flashcards.app.models.requests.UpdateCollectionRequest;
import io.dropwizard.auth.Auth;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;
import java.util.zip.ZipInputStream;


@Path("api/collections")
@Produces(MediaType.APPLICATION_JSON)
public class CollectionDataResource {

    private static final Logger log = LoggerFactory.getLogger(CollectionDataResource.class);
    private final CollectionManager collectionManager;
    private final UserValidationManager userValidationManager;


    public CollectionDataResource(CollectionManager collectionDataManager, UserValidationManager userValidationManager) {
        this.collectionManager = collectionDataManager;
        this.userValidationManager = userValidationManager;
    }

    @GET
    public Response listCollections(@Auth User user) {
        List<CollectionInfo> collectionInfo = collectionManager.getCollections(user.getUserId());
        return Response.ok(collectionInfo).build();
    }

    @GET
    @Path("/{collectionId}")
    public Response getCollection(@Auth User user, @PathParam("collectionId") long collectionId) {
        userValidationManager.validateUserHasCollection(user, collectionId);
        Optional<CollectionInfo> collectionInfo = collectionManager.getCollection(collectionId);
        if (collectionInfo.isEmpty()) {
            return Response.noContent().build();
        }
        return Response.ok(collectionInfo.get()).build();
    }

    @PUT
    @Path("/{collectionId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateCollectionName(@Auth User user,
                                     @PathParam("collectionId") long collectionId,
                                     @NotNull UpdateCollectionRequest updateCollectionRequest) {
        userValidationManager.validateUserHasCollection(user, collectionId);
        collectionManager.updateCollection(collectionId, updateCollectionRequest.getCollectionName());
        return Response.ok().build();
    }

    @DELETE
    @Path("/{collectionId}")
    public Response deleteCollection(@Auth User user, @PathParam("collectionId") long collectionId) {
        userValidationManager.validateUserHasCollection(user, collectionId);
        collectionManager.deleteCollection(collectionId);
        return Response.ok().build();
    }

    @POST
    @Path("/select/{collectionId}")
    public Response selectCollection(@Auth User user, @PathParam("collectionId") long collectionId) {
        userValidationManager.validateUserHasCollection(user, collectionId);
        collectionManager.setActiveCollection(user.getUserId(), collectionId);
        return Response.ok().build();
    }

    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response collectionZip(@Auth User user,
                              @FormDataParam("file") InputStream file
    ) {

        log.info("File Uploaded {}", file);
        long collectionId;
        try (Workbook workbook = WorkbookFactory.create(file)) {
            collectionId = collectionManager.storeExcelFile(workbook, user.getUserId());
        } catch (IOException e) {
            log.error("throwing {}", e.getMessage());
            return Response.status(400, String.format("Error loading jsons from zip file %s", e.getMessage())).build();
        }

        return Response.accepted(collectionId).build();
    }


}
