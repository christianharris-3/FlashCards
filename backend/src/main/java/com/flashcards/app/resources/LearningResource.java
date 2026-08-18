package com.flashcards.app.resources;

import com.flashcards.app.managers.LearningManager;
import com.flashcards.app.managers.UserValidationManager;
import com.flashcards.app.models.User;
import com.flashcards.app.models.dao.FlashCardData;
import com.flashcards.app.models.dao.FlashCardInLearningInstance;
import com.flashcards.app.models.requests.AddFlashCardLogRequest;
import com.flashcards.app.models.requests.CreateLearningInstanceRequest;
import com.flashcards.app.models.response.CreateLearningInstanceResponse;
import io.dropwizard.auth.Auth;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("api/learn")
@Produces(MediaType.APPLICATION_JSON)
public class LearningResource {

    private final LearningManager learningManager;
    private final UserValidationManager userValidationManager;

    public LearningResource(LearningManager learningManager, UserValidationManager userValidationManager) {
        this.learningManager = learningManager;
        this.userValidationManager = userValidationManager;
    }

    @POST
    @Path("/log-flashcard-use/{flashCardUseId}")
    public Response logFlashCardUse(@Auth User user,
                                    @PathParam("flashCardUseId") long flashCardUseId,
                                    @NotNull @Valid AddFlashCardLogRequest request) {
        userValidationManager.validateUserHasFlashCardUse(user, flashCardUseId);
        learningManager.logFlashCardUse(
                flashCardUseId,
                request.getTimestamp(),
                request.getTimeTakenMs(),
                request.getUserFeedback());
        return Response.accepted().build();
    }

    @GET
    @Path("/{learningInstanceId}")
    public Response loadingLearningInstanceCards(@Auth User user, @PathParam("learningInstanceId") long learningInstanceId) {
        userValidationManager.validateUserHasLearningInstance(user, learningInstanceId);
        List<FlashCardInLearningInstance> cards = learningManager.getLearningInstanceCards(learningInstanceId);
        return Response.accepted(cards).build();
    }

    @POST
    @Path("/create/{learningType}/{collectionId}")
    public Response createLearningInstance(@Auth User user,
                                           @PathParam("learningType") String learningType,
                                           @PathParam("collectionId") long collectionId,
                                           @NotNull CreateLearningInstanceRequest request
    ) {
        userValidationManager.validateUserHasCollection(user, collectionId);
        long learningInstanceId = learningManager.createLearningInstance(collectionId, learningType, request.getStartIndex(), request.getEndIndex());
        return Response.accepted(
                new CreateLearningInstanceResponse(learningInstanceId)
        ).build();
    }

//    @POST
//    @Path("/create/priority/{collectionId}")
//    public Response createLearningInstancePriority(@Auth User user,
//                                                   @PathParam("collectionId") long collectionId,
//                                                   @NotNull CreateLearningInstanceRequest request
//    ) {
//        userValidationManager.validateUserHasCollection(user, collectionId);
//        long learningInstanceId = learningManager.createLearningInstancePriority(collectionId, request.getStartIndex(), request.getEndIndex());
//        return Response.accepted(
//                new CreateLearningInstanceResponse(learningInstanceId)
//        ).build();
//    }
//
//    @POST
//    @Path("/create/inorder/{collectionId}")
//    public Response createLearningInstanceInOrder(@Auth User user,
//                                                   @PathParam("collectionId") long collectionId,
//                                                   @NotNull CreateLearningInstanceRequest request
//    ) {
//        userValidationManager.validateUserHasCollection(user, collectionId);
//        long learningInstanceId = learningManager.createLearningInstanceInOrder(collectionId, request.getStartIndex(), request.getEndIndex());
//        return Response.accepted(
//                new CreateLearningInstanceResponse(learningInstanceId)
//        ).build();
//    }
//
//    @POST
//    @Path("/create/random/{collectionId}")
//    public Response createLearningInstanceRandom(@Auth User user,
//                                                   @PathParam("collectionId") long collectionId,
//                                                   @NotNull CreateLearningInstanceRequest request
//    ) {
//        userValidationManager.validateUserHasCollection(user, collectionId);
//        long learningInstanceId = learningManager.createLearningInstanceRandom(collectionId, request.getStartIndex(), request.getEndIndex());
//        return Response.accepted(
//                new CreateLearningInstanceResponse(learningInstanceId)
//        ).build();
//    }
}
